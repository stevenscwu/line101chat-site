# Japanese After 50 - Content System MVP

Personal Japanese study dashboard built with Next.js App Router and local file-based content.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current Pages

- `/` Home snapshot
- `/dashboard`
- `/materials`
- `/materials/[id]`
- `/pronunciation-lab`
- `/study-log`
- `/weekly-review`
- `/content-studio`

## Content System

Seed data and content models:

- [`data/materials.ts`](data/materials.ts)
- [`data/study-logs.ts`](data/study-logs.ts)
- [`data/weekly-reviews.ts`](data/weekly-reviews.ts)
- [`data/today-focus.ts`](data/today-focus.ts)
- [`lib/content/types.ts`](lib/content/types.ts)
- [`lib/content/repository.ts`](lib/content/repository.ts)

The repository layer provides:

- materials list/detail lookup
- sentence splitting for pronunciation lab
- dashboard metrics (streak, totals, latest entries)
- generated content studio cards

## Reset Workflow (Optional)

If you need to wipe the site again before a rebuild:

```bash
npm run reset:site
npm run reset:site:cloud
npm run reset:site:dry-run
```
