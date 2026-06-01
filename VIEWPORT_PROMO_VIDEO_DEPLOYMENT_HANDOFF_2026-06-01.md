# LINE101Chat Viewport-Gated Promo Video Handoff

Generated: 2026-06-01
Status: deployed and live

## Purpose

This checkpoint records the homepage promo-video performance fix deployed after the `short-video-004` homepage release.

Read this file before changing the homepage promo section, replacing the public MP4, or cleaning local video files.

## Production Result

The homepage promo video is still displayed immediately below the hero section, but its `<video>` element and MP4 `<source>` are no longer mounted during the initial page render.

The browser receives a black vertical placeholder first. The real video mounts only after the promo card enters or approaches the viewport.

- Production site: `https://line101chat.com/`
- English route: `https://line101chat.com/en`
- Approved public MP4: `https://line101chat.com/videos/line101chat-hook-promo-9s.mp4`
- Approved poster: `https://line101chat.com/videos/line101chat-hook-promo-9s-poster.png`
- GitHub PR: `https://github.com/stevenscwu/line101chat-site/pull/7`
- GitHub squash commit on `main`: `7fdd15291afb7287631dcc2a7341125d5a29d37f`
- PR merged at: `2026-06-01T02:03:35Z`
- Vercel deployment ID: `dpl_GzhBsQm4T2y8YGHDmZeyhom8a9ky`
- Vercel deployment URL: `https://line101chat-site-ae28k6v88-line101chats-projects.vercel.app`
- Vercel inspector: `https://vercel.com/line101chats-projects/line101chat-site/GzhBsQm4T2y8YGHDmZeyhom8a9ky`
- Public alias: `https://line101chat.com`

The direct deployment URL is protected and returned `401 Unauthorized` during verification. The public alias is the correct customer-facing URL.

## Why This Fix Was Needed

The homepage promo used an inline `<video>` with `autoPlay` and `preload="metadata"`.

Even though the promo section is below the fold, a browser may fetch video data as soon as an autoplay video and its MP4 source are mounted. Because `HomeContent` serves both `/` and `/en`, that caused an unnecessary initial transfer on both routes.

## Website Change

Committed files:

- `src/components/ViewportPromoVideo.tsx`
- `src/app/page.tsx`

`src/components/ViewportPromoVideo.tsx` is a client component that:

- Uses `IntersectionObserver`.
- Observes the existing phone-style video card.
- Uses `rootMargin: "200px"`.
- Uses `threshold: 0.2`.
- Renders only a black `aspect-[9/16]` placeholder before intersection.
- Mounts `<video>` and `<source>` only after the card approaches the viewport.
- Disconnects the observer after the video becomes visible.
- Falls back to mounting on the browser animation queue if `IntersectionObserver` is unavailable.
- Preserves the previous visual classes and vertical phone layout.
- Preserves `controls`, `autoPlay`, `muted`, `loop`, `playsInline`, and `preload="metadata"` after mounting.

`src/app/page.tsx` now imports the component and passes:

```tsx
<ViewportPromoVideo
  src="/videos/line101chat-hook-promo-9s.mp4"
  poster="/videos/line101chat-hook-promo-9s-poster.png"
  ariaLabel={isEnglish ? "LINE101Chat promotional video" : "LINE101Chat LINE AI 知識助理宣傳短片"}
/>
```

Do not move the MP4 `<source>` back into the server-rendered homepage.

## Verification Completed

Local checks:

- `npm run lint`
- `npm run build`
- `git diff --check -- src/app/page.tsx src/components/ViewportPromoVideo.tsx`

GitHub and Vercel:

- PR `#7` preview checks passed.
- PR `#7` was squash-merged into `main`.
- Production `Vercel - line101chat` status passed.
- Production `Vercel - line101chat-site` status passed.
- Vercel deployment `dpl_GzhBsQm4T2y8YGHDmZeyhom8a9ky` is `Ready`.

Live HTTP checks:

- `GET https://line101chat.com/` returned `200`.
- `GET https://line101chat.com/en` returned `200`.
- Both initial HTML responses contain the vertical black placeholder.
- Both initial HTML responses contain no `<video>` tag.
- Both initial HTML responses contain no `<source>` tag.

The serialized client payload may still include the MP4 path as a component prop. That string alone does not request the MP4. The transfer starts only after the client mounts the actual video element near the viewport.

## Approved Live Promo Asset

The approved website asset remains:

```text
public/videos/line101chat-hook-promo-9s.mp4
```

The approved poster remains:

```text
public/videos/line101chat-hook-promo-9s-poster.png
```

The live asset came from the `short-video-004` production package. Its dedicated local handoff is:

```text
SHORT_VIDEO_004_WEBSITE_DEPLOYMENT_HANDOFF_2026-05-31.md
```

Do not replace the approved MP4 with older untracked experiments under `public/videos/`.

## Local Short Video 005 Package

A separate clean planning package exists locally:

```text
marketing-assets/short-video-005/
```

It contains:

- Source-boundary rules
- Script and storyboard
- Avatar direction
- Motion plan
- Traditional Chinese guide voiceover text and WAV
- Subtitles
- Visual prompts
- LongCat generation plan
- LongCat JSON template
- Quality audit
- YouTube caption

This package did not generate a final MP4 and was not deployed.

LongCat-Video-Avatar 1.5 could not run locally because:

- The LongCat repository is not installed.
- The approximately `74.9 GB` checkpoint is not installed.
- The published v1.5 workflow expects a dual-GPU environment.
- This workstation exposed one NVIDIA GeForce RTX 5080 with about `16 GB` VRAM.

Do not confuse `short-video-005` planning files with the approved live `short-video-004` asset.

## Local Git State At Checkpoint

At the start of this documentation checkpoint:

- `origin/main` points to deployed commit `7fdd15291afb7287631dcc2a7341125d5a29d37f`.
- A clean documentation branch was created from `origin/main`:

```text
codex/save-viewport-promo-handoff
```

The worktree also contains unrelated local edits and untracked materials. Preserve them.

Important:

- Do not use `git add -A`.
- Do not use `git reset --hard`.
- Do not remove untracked folders broadly.
- Stage future changes with explicit file paths.
- Review internal business files before publishing them to a public repository.

Notable local-only materials include:

- `NEXT_DEVELOPER_HANDOFF.md` with broader unstaged edits
- `SHORT_VIDEO_004_WEBSITE_DEPLOYMENT_HANDOFF_2026-05-31.md`
- `business-review/`
- `marketing-assets/`
- Older rejected video experiments under `public/videos/`
- `src/app/ai-knowledge-assistant/`
- Local proposal, summary, and review documents

## Recommended Next Development Step

Before starting new work:

1. Read this checkpoint.
2. Run `git status --short --branch`.
3. Preserve unrelated local materials.
4. Start from current `origin/main`.
5. Stage only the files intentionally changed for the next task.
