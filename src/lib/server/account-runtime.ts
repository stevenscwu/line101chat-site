import "server-only";
import { unavailable } from "./account-access";
import { accountErrorResponse, createAccountHandlers } from "./account-http";
import { createSupabaseAccountDependencies, readSupabaseAccountConfig } from "./supabase-account";

/** No configuration or migration means no account access. No demo identity,
 * shared deployment secret, filesystem, or in-memory production fallback exists.
 * Root deployment/configuration remains a separate authorized release step.
 */
export function accountLibraryUnavailable(): Response {
  try { unavailable(); } catch (error) { return accountErrorResponse(error); }
}

export async function dispatchAccountRequest(request: Request, operation: "usage" | "list" | "get" | "create" | "replace", id?: string): Promise<Response> {
  const config = readSupabaseAccountConfig();
  if (!config) return accountLibraryUnavailable();
  try {
    const handlers = createAccountHandlers(createSupabaseAccountDependencies(request, config));
    if (operation === "usage") return await handlers.usage(request);
    if (operation === "list") return await handlers.list(request);
    if (operation === "create") return await handlers.create(request);
    if (!id) return accountErrorResponse(new Error("Missing account lesson ID"));
    return operation === "get" ? await handlers.get(request, id) : await handlers.replace(request, id);
  } catch (error) { return accountErrorResponse(error); }
}
