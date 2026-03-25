import { createHash } from "node:crypto";
import path from "node:path";
import { list, type ListBlobResultBlob, put } from "@vercel/blob";
import {
  MaterialKind,
  MaterialRecord,
  MaterialUploadOptions,
  MaterialUploadResult,
  MaterialVersion
} from "@/lib/materials/types";

const CLOUD_PREFIX = "materials-v2/";
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const SHA_PREFIX_LENGTH = 12;

const extensionMimeMap: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",
  ".json": "application/json"
};

export function isCloudMaterialsConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function sanitizeSegment(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u30ff]+/gu, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "material"
  );
}

function deriveLogicalKey(filename: string): string {
  const ext = path.extname(filename);
  const withoutExt = filename.slice(0, Math.max(0, filename.length - ext.length));
  return sanitizeSegment(withoutExt);
}

function resolveLogicalKey(filename: string, options?: MaterialUploadOptions): string {
  const requestedMaterialId = options?.materialId?.trim();
  if (requestedMaterialId) {
    return sanitizeSegment(requestedMaterialId);
  }
  return deriveLogicalKey(filename);
}

function getMimeType(filename: string, providedMimeType: string): string {
  if (providedMimeType) {
    return providedMimeType;
  }
  return extensionMimeMap[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

function deriveMaterialKind(mimeType: string, filename: string): MaterialKind {
  const ext = path.extname(filename).toLowerCase();
  const mime = mimeType || "";

  if (mime === "application/pdf" || ext === ".pdf") {
    return "pdf";
  }
  if (mime.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) {
    return "image";
  }
  if (mime.startsWith("text/") || [".txt", ".md", ".csv", ".json"].includes(ext)) {
    return "text";
  }
  return "other";
}

function estimateExtractedItemsFromSize(sizeBytes: number, kind: MaterialKind): number {
  if (kind === "pdf") {
    return Math.max(6, Math.min(40, Math.round(sizeBytes / 18_000)));
  }
  if (kind === "image") {
    return Math.max(3, Math.min(20, Math.round(sizeBytes / 120_000)));
  }
  if (kind === "text") {
    return Math.max(1, Math.min(80, Math.round(sizeBytes / 800)));
  }
  return Math.max(1, Math.min(16, Math.round(sizeBytes / 60_000)));
}

function assertAllowedUpload(fileName: string, mimeType: string, sizeBytes: number): void {
  if (sizeBytes <= 0) {
    throw new Error("檔案內容為空，請重新選擇檔案。");
  }
  if (sizeBytes > MAX_UPLOAD_BYTES) {
    throw new Error("檔案超過 15MB，請先縮小後再上傳。");
  }

  const ext = path.extname(fileName).toLowerCase();
  const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".txt", ".md", ".csv", ".json"];
  const allowedMimePrefixes = ["image/", "text/"];
  const allowedMimes = ["application/pdf", "application/json"];
  const extAllowed = allowedExtensions.includes(ext);
  const mimeAllowed = allowedMimes.includes(mimeType) || allowedMimePrefixes.some((prefix) => mimeType.startsWith(prefix));

  if (!extAllowed && !mimeAllowed) {
    throw new Error("目前僅支援 PDF、圖片與純文字類型檔案。");
  }
}

interface ParsedCloudVersion {
  logicalKey: string;
  version: number;
  sha: string;
  originalFilename: string;
}

function parseCloudPathname(pathnameValue: string): ParsedCloudVersion | null {
  if (!pathnameValue.startsWith(CLOUD_PREFIX)) {
    return null;
  }

  const rest = pathnameValue.slice(CLOUD_PREFIX.length);
  const [logicalKey, versionToken] = rest.split("/", 2);
  if (!logicalKey || !versionToken) {
    return null;
  }

  const matched = /^v(\d{3})--sha([a-f0-9]{12,64})--(.+)$/u.exec(versionToken);
  if (!matched) {
    return null;
  }

  const [, versionRaw, sha, encodedFilename] = matched;
  let originalFilename = encodedFilename;
  try {
    originalFilename = decodeURIComponent(encodedFilename);
  } catch {
    return null;
  }

  return {
    logicalKey,
    version: Number(versionRaw),
    sha,
    originalFilename
  };
}

function toMaterialVersion(blob: ListBlobResultBlob, parsed: ParsedCloudVersion): MaterialVersion {
  const mimeType = getMimeType(parsed.originalFilename, "");
  return {
    version: parsed.version,
    originalFilename: parsed.originalFilename,
    mimeType,
    sizeBytes: blob.size,
    sha256: parsed.sha,
    uploadedAt: blob.uploadedAt.toISOString(),
    storedPath: blob.pathname,
    downloadUrl: blob.downloadUrl || blob.url
  };
}

async function listAllBlobs(prefix: string): Promise<ListBlobResultBlob[]> {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await list({
      prefix,
      cursor,
      limit: 1000
    });

    blobs.push(...response.blobs);
    hasMore = response.hasMore;
    cursor = response.cursor;
  }

  return blobs;
}

export async function listMaterialsCloud(): Promise<MaterialRecord[]> {
  const blobs = await listAllBlobs(CLOUD_PREFIX);
  const grouped = new Map<string, { kind: MaterialKind; versions: MaterialVersion[] }>();

  for (const blob of blobs) {
    const parsed = parseCloudPathname(blob.pathname);
    if (!parsed) {
      continue;
    }

    const mimeType = getMimeType(parsed.originalFilename, "");
    const kind = deriveMaterialKind(mimeType, parsed.originalFilename);
    const version = toMaterialVersion(blob, parsed);

    const current = grouped.get(parsed.logicalKey);
    if (current) {
      current.versions.push(version);
    } else {
      grouped.set(parsed.logicalKey, {
        kind,
        versions: [version]
      });
    }
  }

  const materials: MaterialRecord[] = [];

  for (const [logicalKey, value] of grouped.entries()) {
    const ordered = value.versions.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const latest = ordered[0];
    if (!latest) {
      continue;
    }

    materials.push({
      id: logicalKey,
      logicalKey,
      title: path.basename(latest.originalFilename, path.extname(latest.originalFilename)),
      kind: value.kind,
      status: "processed",
      extractedItems: estimateExtractedItemsFromSize(latest.sizeBytes, value.kind),
      createdAt: ordered[ordered.length - 1]?.uploadedAt ?? latest.uploadedAt,
      updatedAt: latest.uploadedAt,
      latestVersion: Math.max(...ordered.map((version) => version.version)),
      versions: ordered
    });
  }

  return materials.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function uploadMaterialVersionCloud(
  file: File,
  options?: MaterialUploadOptions
): Promise<MaterialUploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalFilename = file.name || "uploaded-file";
  const mimeType = getMimeType(originalFilename, file.type);
  assertAllowedUpload(originalFilename, mimeType, buffer.length);

  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const shaPrefix = sha256.slice(0, SHA_PREFIX_LENGTH);
  const logicalKey = resolveLogicalKey(originalFilename, options);

  const existingBlobs = await listAllBlobs(`${CLOUD_PREFIX}${logicalKey}/`);
  let maxVersion = 0;
  let duplicateDetected = false;

  for (const blob of existingBlobs) {
    const parsed = parseCloudPathname(blob.pathname);
    if (!parsed) {
      continue;
    }

    maxVersion = Math.max(maxVersion, parsed.version);
    if (parsed.sha === sha256 || parsed.sha === shaPrefix) {
      duplicateDetected = true;
    }
  }

  if (duplicateDetected) {
    const currentMaterials = await listMaterialsCloud();
    const existingMaterial = currentMaterials.find((item) => item.logicalKey === logicalKey);
    if (!existingMaterial) {
      throw new Error("偵測到重複檔案，但無法讀取對應素材紀錄。");
    }

    return {
      ok: true,
      duplicate: true,
      message: "這份檔案和雲端最新內容相同，已略過重複上傳。",
      material: existingMaterial
    };
  }

  const nextVersion = maxVersion + 1;
  const versionToken = `v${String(nextVersion).padStart(3, "0")}`;
  const encodedFilename = encodeURIComponent(originalFilename);
  const pathnameValue = `${CLOUD_PREFIX}${logicalKey}/${versionToken}--sha${sha256}--${encodedFilename}`;

  await put(pathnameValue, buffer, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: mimeType
  });

  const refreshed = await listMaterialsCloud();
  const material = refreshed.find((item) => item.logicalKey === logicalKey);

  if (!material) {
    throw new Error("上傳成功，但同步雲端版本資料失敗。");
  }

  return {
    ok: true,
    duplicate: false,
    message: `已上傳至雲端並建立 v${nextVersion} 版本。`,
    material
  };
}
