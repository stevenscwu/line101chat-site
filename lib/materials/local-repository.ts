import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  MaterialKind,
  MaterialRecord,
  MaterialStatus,
  MaterialUploadOptions,
  MaterialUploadResult,
  MaterialVersion
} from "@/lib/materials/types";

interface IndexedMaterialVersion {
  version: number;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
  storedPath: string;
}

interface IndexedMaterialRecord {
  id: string;
  logicalKey: string;
  title: string;
  kind: MaterialKind;
  status: MaterialStatus;
  extractedItems: number;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  versions: IndexedMaterialVersion[];
}

interface MaterialsIndexV2 {
  schemaVersion: 2;
  updatedAt: string;
  materials: IndexedMaterialRecord[];
}

const MATERIALS_ROOT = path.join(process.cwd(), "storage", "materials");
const MATERIALS_INDEX_PATH = path.join(MATERIALS_ROOT, "index.v2.json");
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

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

const mimeExtensionMap: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "text/plain": ".txt",
  "text/markdown": ".md",
  "text/csv": ".csv",
  "application/json": ".json"
};

function sanitizeSegment(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u30ff]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "material";
}

function deriveLogicalKey(filename: string): string {
  const ext = path.extname(filename);
  const withoutExt = filename.slice(0, Math.max(0, filename.length - ext.length));
  return sanitizeSegment(withoutExt);
}

function deriveMaterialKind(mimeType: string, filename: string): MaterialKind {
  const ext = path.extname(filename).toLowerCase();
  const mime = mimeType || extensionMimeMap[ext] || "";

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

function getMimeType(filename: string, providedMimeType: string): string {
  if (providedMimeType) {
    return providedMimeType;
  }
  return extensionMimeMap[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

function estimateExtractedItems(buffer: Buffer, kind: MaterialKind): number {
  if (kind === "text") {
    const text = buffer.toString("utf8");
    const units = text
      .split(/[\n。！？!?]+/u)
      .map((part) => part.trim())
      .filter(Boolean);
    return Math.max(1, Math.min(80, units.length));
  }

  if (kind === "pdf") {
    return Math.max(6, Math.min(40, Math.round(buffer.length / 18_000)));
  }

  if (kind === "image") {
    return Math.max(3, Math.min(20, Math.round(buffer.length / 120_000)));
  }

  return Math.max(1, Math.min(16, Math.round(buffer.length / 60_000)));
}

function toDownloadUrl(storedPath: string): string {
  return `/api/materials/files/${storedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function mapIndexedVersion(version: IndexedMaterialVersion): MaterialVersion {
  return {
    ...version,
    downloadUrl: toDownloadUrl(version.storedPath)
  };
}

function mapIndexedMaterial(material: IndexedMaterialRecord): MaterialRecord {
  return {
    ...material,
    versions: material.versions
      .slice()
      .sort((a, b) => b.version - a.version)
      .map(mapIndexedVersion)
  };
}

async function ensureStorageReady(): Promise<void> {
  await mkdir(MATERIALS_ROOT, { recursive: true });
}

async function readIndex(): Promise<MaterialsIndexV2> {
  await ensureStorageReady();

  try {
    const raw = await readFile(MATERIALS_INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw) as MaterialsIndexV2;
    if (parsed.schemaVersion !== 2 || !Array.isArray(parsed.materials)) {
      throw new Error("Invalid materials index format.");
    }
    return parsed;
  } catch {
    return {
      schemaVersion: 2,
      updatedAt: new Date().toISOString(),
      materials: []
    };
  }
}

async function writeIndex(index: MaterialsIndexV2): Promise<void> {
  await ensureStorageReady();
  const tempPath = `${MATERIALS_INDEX_PATH}.tmp`;
  const payload = JSON.stringify(index, null, 2);
  await writeFile(tempPath, payload, "utf8");
  try {
    await rename(tempPath, MATERIALS_INDEX_PATH);
  } catch {
    await writeFile(MATERIALS_INDEX_PATH, payload, "utf8");
    await rm(tempPath, { force: true });
  }
}

function generateMaterialId(): string {
  return `mat_${Date.now()}_${randomBytes(3).toString("hex")}`;
}

function formatVersionFilename(version: number, originalFilename: string, mimeType: string): string {
  const extFromName = path.extname(originalFilename).toLowerCase();
  const ext = extFromName || mimeExtensionMap[mimeType] || ".bin";
  const filenameBase = sanitizeSegment(path.basename(originalFilename, ext));
  return `v${String(version).padStart(3, "0")}-${filenameBase}${ext}`;
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

export function getMaterialsStorageRoot(): string {
  return MATERIALS_ROOT;
}

export async function listMaterials(): Promise<MaterialRecord[]> {
  const index = await readIndex();

  return index.materials
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map(mapIndexedMaterial);
}

export async function uploadMaterialVersion(
  file: File,
  options?: MaterialUploadOptions
): Promise<MaterialUploadResult> {
  const now = new Date().toISOString();
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name || "uploaded-file";
  const mimeType = getMimeType(fileName, file.type);
  assertAllowedUpload(fileName, mimeType, fileBuffer.length);

  const sha256 = createHash("sha256").update(fileBuffer).digest("hex");
  const logicalKey = deriveLogicalKey(fileName);
  const kind = deriveMaterialKind(mimeType, fileName);

  const index = await readIndex();

  const existingById = options?.materialId
    ? index.materials.find((material) => material.id === options.materialId)
    : undefined;
  const existingByLogicalKey = index.materials.find((material) => material.logicalKey === logicalKey);
  const material = existingById ?? existingByLogicalKey;

  if (material) {
    const latestVersion = material.versions
      .slice()
      .sort((a, b) => b.version - a.version)[0];

    if (latestVersion && latestVersion.sha256 === sha256) {
      return {
        ok: true,
        duplicate: true,
        message: "這份檔案和最新版本相同，已略過重複上傳。",
        material: mapIndexedMaterial(material)
      };
    }
  }

  const materialId = material?.id ?? generateMaterialId();
  const nextVersion = (material?.latestVersion ?? 0) + 1;
  const storedFilename = formatVersionFilename(nextVersion, fileName, mimeType);
  const storedPath = `files/${materialId}/${storedFilename}`;
  const absolutePath = path.join(MATERIALS_ROOT, ...storedPath.split("/"));

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, fileBuffer);

  const versionRecord: IndexedMaterialVersion = {
    version: nextVersion,
    originalFilename: fileName,
    mimeType,
    sizeBytes: fileBuffer.length,
    sha256,
    uploadedAt: now,
    storedPath
  };

  if (material) {
    material.versions.push(versionRecord);
    material.latestVersion = nextVersion;
    material.updatedAt = now;
    material.status = "processed";
    material.extractedItems = estimateExtractedItems(fileBuffer, material.kind);
  } else {
    const newMaterial: IndexedMaterialRecord = {
      id: materialId,
      logicalKey,
      title: path.basename(fileName, path.extname(fileName)),
      kind,
      status: "processed",
      extractedItems: estimateExtractedItems(fileBuffer, kind),
      createdAt: now,
      updatedAt: now,
      latestVersion: nextVersion,
      versions: [versionRecord]
    };
    index.materials.push(newMaterial);
  }

  index.updatedAt = now;
  await writeIndex(index);

  const finalMaterial = index.materials.find((item) => item.id === materialId);
  if (!finalMaterial) {
    throw new Error("上傳完成但找不到更新後的素材記錄。");
  }

  return {
    ok: true,
    duplicate: false,
    message: `已建立 ${finalMaterial.title} 的 v${nextVersion} 版本。`,
    material: mapIndexedMaterial(finalMaterial)
  };
}
