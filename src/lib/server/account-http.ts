import "server-only";
import { MAX_LESSON_BYTES, MaterialError } from "../materials";
import { AccountError, ownerKey, requireAccountWrite, requireIdentity, type Authenticate } from "./account-access";
import { ACCOUNT_MAX_PAGE_SIZE, ACCOUNT_PAGE_SIZE, createAccountLibrary, isAccountCursor, type AccountListOptions, type AccountLessonRepository } from "./account-library";

export type AccountDependencies = {
  authenticate: Authenticate;
  repository: AccountLessonRepository;
  /** Durable, atomic per-owner AND global limits. Throw on limits or outage. */
  rateLimit: (request: Request, owner: string, operation: "read" | "write") => Promise<void>;
};

export function accountResponse(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: {
    "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie, Authorization",
    "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff",
  } });
}

export function accountErrorResponse(error: unknown): Response {
  if (error instanceof AccountError) return accountResponse({ code: error.code, error: error.message }, error.status);
  if (error instanceof MaterialError) return accountResponse({ code: "INVALID_LESSON", error: error.message }, 400);
  // No raw provider errors, identity, lesson text, tokens or storage URLs leave here.
  return accountResponse({ code: "ACCOUNT_SERVICE_UNAVAILABLE", error: "Account library is temporarily unavailable. Please try again later." }, 503);
}

async function body(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new AccountError(415, "UNSUPPORTED_MEDIA_TYPE", "Send lesson data as application/json.");
  }
  // Small allowance for {lesson, expectedRevision}; the lesson itself remains 256 KB.
  const limit = MAX_LESSON_BYTES + 1024;
  if (Number(request.headers.get("content-length")) > limit) throw new AccountError(413, "PAYLOAD_TOO_LARGE", "The request is too large.");
  if (!request.body) throw new AccountError(400, "INVALID_REQUEST", "A lesson is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new AccountError(413, "PAYLOAD_TOO_LARGE", "The request is too large.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new AccountError(400, "INVALID_REQUEST", "Send valid UTF-8 lesson JSON."); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new AccountError(400, "INVALID_REQUEST", "A lesson object is required.");
  return value as Record<string, unknown>;
}

function listOptions(request: Request): AccountListOptions {
  const query = new URL(request.url).searchParams;
  const keys = ["limit", "beforeUpdatedAt", "beforeId"];
  if ([...query.keys()].some((key) => !keys.includes(key) || query.getAll(key).length !== 1)) {
    throw new AccountError(400, "INVALID_PAGINATION", "Only limit and a complete lesson cursor are supported.");
  }
  const requestedLimit = query.get("limit");
  const limit = requestedLimit === null ? ACCOUNT_PAGE_SIZE : Number(requestedLimit);
  if ((requestedLimit !== null && !/^[1-9]\d{0,2}$/.test(requestedLimit)) || limit > ACCOUNT_MAX_PAGE_SIZE) {
    throw new AccountError(400, "INVALID_PAGINATION", "Use a page size from 1 to 100.");
  }
  const updatedAt = query.get("beforeUpdatedAt"); const id = query.get("beforeId");
  const before = updatedAt === null && id === null ? null : { updatedAt, id };
  if (before !== null && !isAccountCursor(before)) {
    throw new AccountError(400, "INVALID_PAGINATION", "Provide both a valid lesson ID and an ISO cursor timestamp.");
  }
  return { limit, before };
}

export function createAccountHandlers(dependencies: AccountDependencies) {
  const library = createAccountLibrary(dependencies.repository);
  async function access(request: Request, operation: "read" | "write") {
    const identity = await requireIdentity(request, dependencies.authenticate);
    if (operation === "write") requireAccountWrite(request, identity);
    await dependencies.rateLimit(request, ownerKey(identity), operation);
    return identity;
  }
  return {
    async list(request: Request) {
      try {
        const identity = await access(request, "read");
        const options = listOptions(request);
        const [page, usage] = await Promise.all([library.list(identity, options), library.usage(identity)]);
        return accountResponse({ ...page, usage });
      }
      catch (error) { return accountErrorResponse(error); }
    },
    async usage(request: Request) {
      try {
        const identity = await access(request, "read");
        if (new URL(request.url).search) throw new AccountError(400, "INVALID_REQUEST", "Usage is available only for your signed-in account.");
        return accountResponse(await library.usage(identity));
      } catch (error) { return accountErrorResponse(error); }
    },
    async get(request: Request, id: string) {
      try { return accountResponse(await library.get(await access(request, "read"), id)); }
      catch (error) { return accountErrorResponse(error); }
    },
    async create(request: Request) {
      try {
        const identity = await access(request, "write");
        const input = await body(request);
        // No owner, role, storage path or visibility accepted from the client.
        if (Object.keys(input).some((key) => key !== "lesson")) throw new AccountError(400, "INVALID_REQUEST", "Only a lesson can be uploaded.");
        return accountResponse(await library.create(identity, input.lesson), 201);
      } catch (error) { return accountErrorResponse(error); }
    },
    async replace(request: Request, id: string) {
      try {
        const identity = await access(request, "write");
        const input = await body(request);
        if (Object.keys(input).some((key) => key !== "lesson" && key !== "expectedRevision") || typeof input.expectedRevision !== "number") {
          throw new AccountError(400, "INVALID_REQUEST", "Send a lesson and its current expectedRevision.");
        }
        return accountResponse(await library.replace(identity, id, input.expectedRevision, input.lesson));
      } catch (error) { return accountErrorResponse(error); }
    },
  };
}
