export type MaterialKind = "pdf" | "image" | "text" | "other";
export type MaterialStatus = "processed" | "processing";

export interface MaterialVersion {
  version: number;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
  storedPath: string;
  downloadUrl: string;
}

export interface MaterialRecord {
  id: string;
  logicalKey: string;
  title: string;
  kind: MaterialKind;
  status: MaterialStatus;
  extractedItems: number;
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  versions: MaterialVersion[];
}

export interface MaterialUploadResult {
  ok: boolean;
  duplicate: boolean;
  message: string;
  material: MaterialRecord;
}

export interface MaterialUploadOptions {
  materialId?: string;
}

export interface MaterialsListResponse {
  materials: MaterialRecord[];
}
