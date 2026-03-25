import {
  listMaterialsCloud,
  uploadMaterialVersionCloud,
  isCloudMaterialsConfigured
} from "@/lib/materials/cloud-repository";
import {
  getMaterialsStorageRoot as getLocalMaterialsStorageRoot,
  listMaterials as listMaterialsLocal,
  uploadMaterialVersion as uploadMaterialVersionLocal
} from "@/lib/materials/local-repository";
import type {
  MaterialRecord,
  MaterialUploadOptions,
  MaterialUploadResult
} from "@/lib/materials/types";

export type MaterialsStorageDriver = "local" | "cloud";
type MaterialsStoragePreference = MaterialsStorageDriver | "auto";

const DEFAULT_STORAGE_PREFERENCE: MaterialsStoragePreference = "auto";
let localOnVercelWarningLogged = false;

function readStoragePreference(): MaterialsStoragePreference {
  const raw = process.env.MATERIALS_STORAGE_DRIVER?.trim().toLowerCase();
  if (raw === "local" || raw === "cloud" || raw === "auto") {
    return raw;
  }
  return DEFAULT_STORAGE_PREFERENCE;
}

function getLikelyDriver(): MaterialsStorageDriver {
  const preference = readStoragePreference();
  if (preference === "local") {
    return "local";
  }
  if (preference === "cloud") {
    return "cloud";
  }
  return isCloudMaterialsConfigured() ? "cloud" : "local";
}

function cloudRequiredError(): Error {
  return new Error(
    "目前已設定雲端素材儲存，但找不到 BLOB_READ_WRITE_TOKEN。請先在 Vercel 專案設定 Blob Token。"
  );
}

function warnLocalStorageOnVercel(): void {
  if (localOnVercelWarningLogged) {
    return;
  }
  const isVercelRuntime = Boolean(process.env.VERCEL);
  if (!isVercelRuntime) {
    return;
  }

  console.warn(
    "[materials] local storage driver is active on Vercel. Uploads may not persist across deployments. Use MATERIALS_STORAGE_DRIVER=cloud with BLOB_READ_WRITE_TOKEN."
  );
  localOnVercelWarningLogged = true;
}

async function runWithDriver<T>(
  cloudFn: () => Promise<T>,
  localFn: () => Promise<T>
): Promise<T> {
  const driver = getLikelyDriver();
  if (driver === "cloud") {
    if (!isCloudMaterialsConfigured()) {
      throw cloudRequiredError();
    }
    return cloudFn();
  }

  warnLocalStorageOnVercel();
  return localFn();
}

export function getMaterialsStorageRoot(): string {
  return getLocalMaterialsStorageRoot();
}

export function getMaterialsStorageDriverHint(): MaterialsStorageDriver {
  return getLikelyDriver();
}

export async function listMaterials(): Promise<MaterialRecord[]> {
  return runWithDriver(listMaterialsCloud, listMaterialsLocal);
}

export async function uploadMaterialVersion(
  file: File,
  options?: MaterialUploadOptions
): Promise<MaterialUploadResult> {
  return runWithDriver(
    () => uploadMaterialVersionCloud(file, options),
    () => uploadMaterialVersionLocal(file, options)
  );
}
