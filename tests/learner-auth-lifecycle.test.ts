// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthClient } from "@supabase/supabase-js";
import { createLearnerAuth, type LearnerAuthPort } from "../src/lib/learner-auth";

const config = { url: "https://lifecycle-fixture.invalid", publishableKey: "sb_publishable_synthetic_lifecycle" };
const redirectTo = "http://localhost:3000/account/auth-return";
const user = {
  id: "11111111-1111-4111-8111-111111111111", email: "learner@example.invalid",
  email_confirmed_at: "2026-10-01T00:00:00Z", is_anonymous: false, aud: "authenticated", role: "authenticated",
};
const browserEvents = ["visibilitychange", "pagehide", "pageshow"];
type ManagedAuthClient = InstanceType<typeof AuthClient>;
let clients: Set<ManagedAuthClient>;
let ports: LearnerAuthPort[];
let listeners: Map<string, Set<EventListenerOrEventListenerObject>>;
let channels: TestBroadcastChannel[];
let fetcher: ReturnType<typeof vi.fn<typeof fetch>>;
let storageGet: ReturnType<typeof vi.spyOn<Storage, "getItem">>;
let storageSet: ReturnType<typeof vi.spyOn<Storage, "setItem">>;
let storageRemove: ReturnType<typeof vi.spyOn<Storage, "removeItem">>;
let nativeRemove: typeof window.removeEventListener;

class TestBroadcastChannel {
  closed = false;
  private listeners = new Set<EventListenerOrEventListenerObject>();
  constructor(readonly name: string) { channels.push(this); }
  addEventListener(_type: string, listener: EventListenerOrEventListenerObject) { this.listeners.add(listener); }
  postMessage() { if (this.closed) throw new Error("Cannot broadcast after disposal"); }
  close() { this.closed = true; this.listeners.clear(); }
}

function create() {
  const port = createLearnerAuth(config, redirectTo);
  ports.push(port);
  return port;
}

async function initialized() {
  await Promise.all([...clients].map((client) => client.initialize()));
  // Allow the port's disposal continuation to finish after initialization.
  await Promise.resolve();
}

function expectReleased() {
  for (const type of browserEvents) expect(listeners.get(type)?.size ?? 0, type).toBe(0);
  expect(channels.length).toBeGreaterThan(0);
  expect(channels.every((channel) => channel.closed)).toBe(true);
  expect(storageGet).not.toHaveBeenCalled();
  expect(storageSet).not.toHaveBeenCalled();
  expect(storageRemove).not.toHaveBeenCalled();
}

function recoveryFragment() {
  const accessToken = [
    btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })),
    btoa(JSON.stringify({ iss: `${config.url}/auth/v1`, aud: "authenticated", role: "authenticated",
      sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 })),
    "synthetic_signature",
  ].map((part) => part.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")).join(".");
  return `#${new URLSearchParams({ type: "recovery", token_type: "bearer", access_token: accessToken,
    refresh_token: "synthetic_refresh_never_a_real_credential" })}`;
}

beforeEach(() => {
  clients = new Set(); ports = []; listeners = new Map(); channels = [];
  // Observe the real pinned SDK; its initialization and disposal still run.
  const initialize = AuthClient.prototype.initialize;
  vi.spyOn(AuthClient.prototype, "initialize").mockImplementation(function (this: ManagedAuthClient) {
    clients.add(this);
    return initialize.call(this);
  });
  const nativeAdd = window.addEventListener.bind(window);
  nativeRemove = window.removeEventListener.bind(window);
  vi.spyOn(window, "addEventListener").mockImplementation((type, listener, options) => {
    if (browserEvents.includes(type)) {
      const registered = listeners.get(type) ?? new Set();
      registered.add(listener); listeners.set(type, registered);
    }
    nativeAdd(type, listener, options);
  });
  vi.spyOn(window, "removeEventListener").mockImplementation((type, listener, options) => {
    listeners.get(type)?.delete(listener);
    nativeRemove(type, listener, options);
  });
  storageGet = vi.spyOn(Storage.prototype, "getItem");
  storageSet = vi.spyOn(Storage.prototype, "setItem");
  storageRemove = vi.spyOn(Storage.prototype, "removeItem");
  vi.stubGlobal("BroadcastChannel", TestBroadcastChannel);
  fetcher = vi.fn<typeof fetch>().mockImplementation(async () => { throw new Error("Unexpected network request forbidden by lifecycle test"); });
  vi.stubGlobal("fetch", fetcher);
});

afterEach(async () => {
  for (const port of ports) port.dispose();
  await initialized();
  await Promise.all([...clients].map((client) => client.dispose()));
  // Also isolate later tests if a regression leaked a listener.
  for (const [type, callbacks] of listeners) for (const callback of callbacks) nativeRemove(type, callback);
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

describe("learner Auth lifecycle with the real SDK", () => {
  it("removes listeners registered after immediate disposal, including repeated Strict Mode mounts", async () => {
    for (let index = 0; index < 3; index++) {
      const port = create();
      port.dispose(); port.dispose();
    }
    await initialized();
    expectReleased();
    window.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pageshow"));
    await Promise.resolve();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("removes settled listeners without creating unused Realtime page lifecycle handlers", async () => {
    const port = create();
    await initialized();
    expect(listeners.get("visibilitychange")?.size).toBe(1);
    expect(listeners.get("pagehide")?.size ?? 0).toBe(0);
    expect(listeners.get("pageshow")?.size ?? 0).toBe(0);
    port.dispose();
    await initialized();
    expectReleased();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("clears an abandoned recovery session and cannot use its credentials after disposal", async () => {
    fetcher.mockImplementation(async (input, init) => {
      expect(String(input)).toBe(`${config.url}/auth/v1/user`);
      expect(init).toMatchObject({ method: "GET", credentials: "omit", cache: "no-store", redirect: "error" });
      return Response.json(user);
    });
    const port = create();
    await expect(port.acceptEmailLink(recoveryFragment())).resolves.toEqual({ kind: "recovery", email: user.email });
    expect(fetcher).toHaveBeenCalledTimes(2);
    const [client] = clients;
    expect((await client.getSession()).data.session?.user.id).toBe(user.id);
    port.dispose();
    await initialized();
    expectReleased();
    expect((await client.getSession()).data.session).toBeNull();
    await expect(port.updatePassword("synthetic_new_passphrase")).rejects.toMatchObject({ code: "UNAVAILABLE" });
    window.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("pageshow"));
    await Promise.resolve();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("aborts pending verification and rejects its late response without restoring a session", async () => {
    let resolve!: (response: Response) => void;
    fetcher.mockImplementation(() => new Promise<Response>((done) => { resolve = done; }));
    const port = create();
    const accepted = port.acceptEmailLink(recoveryFragment());
    const rejected = expect(accepted).rejects.toMatchObject({ code: "INVALID_LINK" });
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    const signal = fetcher.mock.calls[0][1]?.signal;
    port.dispose();
    expect(signal?.aborted).toBe(true);
    // A transport that ignores abort must not be able to revive credentials.
    resolve(Response.json(user));
    await rejected;
    await initialized();
    expectReleased();
    const [client] = clients;
    expect((await client.getSession()).data.session).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
