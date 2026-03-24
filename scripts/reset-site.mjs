#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const confirmed = args.has("--yes");
const pushToGithub = args.has("--push");
const deployToVercel = args.has("--deploy");
const localOnly = args.has("--local-only");

if (!confirmed) {
  console.error(
    "This script is destructive. Re-run with --yes.\nExample: node scripts/reset-site.mjs --yes"
  );
  process.exit(1);
}

if (localOnly && (pushToGithub || deployToVercel)) {
  console.error("Use either --local-only or cloud flags (--push / --deploy), not both.");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
process.chdir(repoRoot);

const pathsToDelete = [
  "app/api",
  "components",
  "lib",
  "public/images",
  "public/thesis",
  ".next",
  ".vercel",
  "out"
];

const directoriesToCreate = ["app", "components", "lib", "public"];

const filesToWrite = new Map([
  [
    "app/layout.tsx",
    `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "line101chat-site",
  description: "Clean baseline before rebuilding the website."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  ],
  [
    "app/page.tsx",
    `export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight">Site reset complete</h1>
      <p className="mt-4 text-slate-600">
        This repository is now cleaned and ready for the next website build.
      </p>
    </main>
  );
}
`
  ],
  [
    "app/globals.css",
    `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

body {
  @apply bg-white text-slate-900 antialiased;
}
`
  ],
  ["components/.gitkeep", "\n"],
  ["lib/.gitkeep", "\n"],
  ["public/.gitkeep", "\n"]
]);

function logStep(message) {
  console.log(`\n==> ${message}`);
}

function quoteArg(value) {
  if (/[\s"]/u.test(value)) {
    return `"${value.replaceAll('"', '\\"')}"`;
  }
  return value;
}

function runCommand(command, commandArgs, stepLabel) {
  const commandLine = [command, ...commandArgs.map(quoteArg)].join(" ");
  logStep(stepLabel);

  if (dryRun) {
    console.log(`[dry-run] ${commandLine}`);
    return { status: 0, stdout: "", stderr: "" };
  }

  const result = spawnSync(commandLine, {
    encoding: "utf8",
    shell: true
  });

  if (result.error) {
    throw new Error(`Failed to run "${commandLine}": ${result.error.message}`);
  }

  if (result.stdout?.trim()) {
    console.log(result.stdout.trim());
  }

  if (result.stderr?.trim()) {
    console.error(result.stderr.trim());
  }

  if (result.status !== 0) {
    throw new Error(`Command failed (${result.status}): ${commandLine}`);
  }

  return result;
}

async function removePath(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!existsSync(fullPath)) {
    return;
  }

  if (dryRun) {
    console.log(`[dry-run] remove ${relativePath}`);
    return;
  }

  await rm(fullPath, { recursive: true, force: true });
  console.log(`removed ${relativePath}`);
}

async function ensureDirectory(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (dryRun) {
    console.log(`[dry-run] ensure dir ${relativePath}`);
    return;
  }

  await mkdir(fullPath, { recursive: true });
}

async function writeProjectFile(relativePath, content) {
  const fullPath = path.join(repoRoot, relativePath);

  if (dryRun) {
    console.log(`[dry-run] write ${relativePath}`);
    return;
  }

  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf8");
  console.log(`wrote ${relativePath}`);
}

function syncGithub() {
  runCommand("git", ["rev-parse", "--is-inside-work-tree"], "Validating Git repository");
  runCommand("git", ["add", "-A"], "Staging cleaned baseline");

  const status = runCommand(
    "git",
    ["status", "--porcelain"],
    "Checking for staged differences"
  );

  if (!status.stdout.trim()) {
    console.log("No local changes to commit.");
    return;
  }

  runCommand(
    "git",
    ["commit", "-m", "chore: reset website content before rebuild"],
    "Committing cleaned baseline"
  );
  runCommand("git", ["push", "origin", "HEAD"], "Pushing cleaned baseline to GitHub");
}

function deployCloudPlaceholder() {
  runCommand(
    "npx",
    ["vercel", "deploy", "--prod", "--yes"],
    "Deploying clean placeholder to Vercel production"
  );
}

async function main() {
  logStep("Resetting local website content");

  for (const relativePath of pathsToDelete) {
    await removePath(relativePath);
  }

  for (const relativePath of directoriesToCreate) {
    await ensureDirectory(relativePath);
  }

  for (const [relativePath, content] of filesToWrite) {
    await writeProjectFile(relativePath, content);
  }

  console.log("\nLocal cleanup completed.");

  if (!localOnly && pushToGithub) {
    syncGithub();
  }

  if (!localOnly && deployToVercel) {
    deployCloudPlaceholder();
  }

  console.log("\nReset flow completed successfully.");
}

main().catch((error) => {
  console.error(`\nReset failed: ${error.message}`);
  process.exit(1);
});
