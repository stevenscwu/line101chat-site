import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getMaterialsStorageRoot } from "@/lib/materials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mimeFromFilePath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };
  return map[ext] ?? "application/octet-stream";
}

interface FileRouteParams {
  params: Promise<{
    segments: string[];
  }>;
}

export async function GET(_request: Request, { params }: FileRouteParams) {
  try {
    const { segments } = await params;
    if (!Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json({ message: "檔案路徑無效。" }, { status: 400 });
    }

    const decodedSegments = segments.map((segment) => decodeURIComponent(segment));
    const root = path.resolve(getMaterialsStorageRoot());
    const absolutePath = path.resolve(root, ...decodedSegments);

    if (!absolutePath.startsWith(root)) {
      return NextResponse.json({ message: "不允許的檔案路徑。" }, { status: 403 });
    }

    const content = await readFile(absolutePath);
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mimeFromFilePath(absolutePath),
        "Cache-Control": "private, max-age=0, must-revalidate"
      }
    });
  } catch {
    return NextResponse.json({ message: "找不到檔案。" }, { status: 404 });
  }
}
