# MATERIALS_VERSIONING_V2.md

## Goals
- Allow real upload flow for study materials (PDF / image / text).
- Keep every material change traceable with immutable versions.
- Prevent duplicate uploads from creating noisy fake versions.
- Support cloud-persistent storage for Vercel deployment (v2.1).

## Data Versioning Model

### Index file
- Path: `storage/materials/index.v2.json`
- Root field: `schemaVersion: 2`
- Stores material-level metadata and full version history.

### Material identity
- `logicalKey`: derived from filename base (slug).
- Same logical key upload => append new version (`v1`, `v2`, ...).

### Version record
Each version stores:
- `version` number
- `originalFilename`
- `mimeType`
- `sizeBytes`
- `sha256` checksum
- `uploadedAt`
- immutable `storedPath`

## Duplicate Protection
- If uploaded file hash equals latest version hash, system returns duplicate message.
- No new version is created for exact duplicate content.

## Storage Layout
- Local file root: `storage/materials/files/<materialId>/vNNN-<name>.<ext>`
- Files are immutable by version naming convention.
- Cloud (Vercel Blob): `materials-v2/<logicalKey>/vNNN--sha<sha256>--<encodedFilename>`
- Files are immutable by version naming convention.

## Storage Driver (v2.1)
- `MATERIALS_STORAGE_DRIVER=auto` (default):
  - if `BLOB_READ_WRITE_TOKEN` exists -> use cloud repository
  - else -> use local repository
- `MATERIALS_STORAGE_DRIVER=cloud`: force cloud repository
- `MATERIALS_STORAGE_DRIVER=local`: force local repository

For Vercel production persistence, use:
- `MATERIALS_STORAGE_DRIVER=cloud`
- `BLOB_READ_WRITE_TOKEN=<your token>`

## API v2
- `GET /api/materials` => list versioned materials
- `POST /api/materials/upload` => upload file and create version
- `GET /api/materials/files/[...segments]` => download/preview stored file

Notes:
- In cloud mode, `downloadUrl` points to Vercel Blob URL directly.
- The local files API route remains available for local-storage fallback.

## Git Version Control Strategy (Code + Product)
- Keep code in Git as usual on `main` and feature branches.
- Tag releases for stable milestones:
  - `v2.0.0-materials-upload`
  - `v2.1.0-materials-cloud-persistent`
- Do not commit runtime uploaded binaries:
  - `storage/materials/**` ignored except `.gitkeep`.

## Operations

### Recommended workflow for changes
1. Create feature branch (`feature/materials-v2`).
2. Implement + test upload/versioning behavior.
3. Merge into `main` with release notes.
4. Tag release with semantic version.

### Backup recommendation
- Daily backup `storage/materials/index.v2.json`.
- Backup `storage/materials/files/` with timestamp snapshot.
- For cloud mode, rely on Vercel Blob durability and add periodic metadata export if needed.
