import assert from "node:assert/strict";
import { spawn } from "node:child_process";

// Checks only the local configured page and rejection of unauthenticated requests.
// Never submits credentials, signs in, creates accounts, or contacts email flows.
const port = 3191;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"],
});
server.stderr.on("data", (chunk) => process.stderr.write(chunk));
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Production server did not become ready.")), 15000);
    server.once("error", (error) => { clearTimeout(timeout); reject(error); });
    server.once("exit", (code) => { clearTimeout(timeout); reject(new Error(`Production server exited: ${code}`)); });
    server.stdout.on("data", (chunk) => { if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
  });
  const root = `http://127.0.0.1:${port}`;
  for (const path of ["signup", "recover", "auth-return"]) {
    const response = await fetch(`${root}/account/${path}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    const body = await response.text();
    assert.match(body, /noindex/);
    assert.match(body, /說日語/);
    assert.doesNotMatch(body, /JAPANESE &amp; ENGLISH/);
  }
  const page = await fetch(`${root}/account`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("cache-control"), /no-store/);
  assert.match(page.headers.get("content-security-policy"), /connect-src 'self' https:\/\/[^\s;]+\/auth\/v1\//);
  const html = await page.text();
  assert.match(html, /個人教材庫/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /尚未啟用/);
  for (const method of ["GET", "POST"]) {
    const response = await fetch(`${root}/api/account/lessons`, { method });
    assert.equal(response.status, 401);
    assert.equal((await response.json()).code, "AUTHENTICATION_REQUIRED");
  }
  assert.equal((await fetch(`${root}/`)).status, 200);
  console.log("Passed 27 configured local HTTP checks. No authentication or account mutation attempted.");
} finally { server.kill("SIGTERM"); }
