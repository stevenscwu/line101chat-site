import assert from "node:assert/strict";
import { spawn } from "node:child_process";

// Uses the locally built production server, no cloud services or real credentials.
// Keep server and requests in one process tree for isolated execution sandboxes.
const port = 3187;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ACCOUNT_BACKEND: "", SUPABASE_URL: "", SUPABASE_PUBLISHABLE_KEY: "" }, stdio: ["ignore", "pipe", "pipe"],
});
server.stderr.on("data", (chunk) => process.stderr.write(chunk));
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Production server did not become ready.")), 15000);
    server.once("error", (error) => { clearTimeout(timeout); reject(error); });
    server.once("exit", (code) => { clearTimeout(timeout); reject(new Error(`Production server exited: ${code}`)); });
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Ready")) { clearTimeout(timeout); resolve(); }
    });
  });
  const root = `http://127.0.0.1:${port}`;
  let checks = 0;
  for (const [method, path] of [
    ["GET", "/api/account/lessons"], ["POST", "/api/account/lessons"],
    ["GET", "/api/account/lessons/00000000-0000-4000-8000-000000000000"],
    ["PUT", "/api/account/lessons/00000000-0000-4000-8000-000000000000"],
  ]) {
    const response = await fetch(root + path, { method, headers: {
      "content-type": "application/json", "x-user-id": "not-a-session", authorization: "Bearer not-a-session",
    }, ...(method === "POST" || method === "PUT" ? { body: "{}" } : {}) });
    assert.equal(response.status, 503);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.match(response.headers.get("vary"), /Authorization/);
    assert.equal((await response.json()).code, "ACCOUNT_SERVICE_UNAVAILABLE");
    checks++;
  }
  assert.equal((await fetch(root + "/api/account/lessons", { method: "DELETE" })).status, 405);
  checks++;
  const transfer = await fetch(root + "/api/transfers");
  assert.equal(transfer.status, 200);
  // Transfer availability depends on the host's own configuration; do not assert it.
  assert.equal(typeof (await transfer.json()).available, "boolean");
  checks++;
  const home = await fetch(root + "/");
  assert.equal(home.status, 200);
  assert.match(await home.text(), /說日語/);
  checks++;
  console.log(`Passed ${checks} local production HTTP checks.`);
} finally {
  server.kill("SIGTERM");
}
