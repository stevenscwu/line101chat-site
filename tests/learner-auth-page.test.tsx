// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import type { LearnerAuthPort } from "../src/lib/learner-auth";
const mock = vi.hoisted(() => ({ auth: null as LearnerAuthPort | null }));
vi.mock("../src/lib/learner-auth", async (importOriginal) => ({ ...await importOriginal<typeof import("../src/lib/learner-auth")>(), createLearnerAuth: () => mock.auth!, authReturnUrl: () => "https://line101chat.com/account/auth-return" }));
import { LearnerAuthError } from "../src/lib/learner-auth";
import { LearnerAuthPage } from "../src/components/learner-auth-page";
const config = { url: "https://auth-fixture.invalid", publishableKey: "sb_publishable_synthetic" };
const password = "synthetic-password-only";
beforeEach(() => {
  window.history.replaceState(null, "", "/"); localStorage.clear(); sessionStorage.clear();
  mock.auth = { signUp: vi.fn(async () => {}), resendConfirmation: vi.fn(async () => {}), requestPasswordReset: vi.fn(async () => {}), acceptEmailLink: vi.fn(async () => ({ kind: "recovery" as const, email: "learner@example.invalid" })), updatePassword: vi.fn(async () => {}), dispose: vi.fn() };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
async function fields() {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("電子郵件"), "learner@example.invalid");
  await user.type(screen.getByLabelText("密碼"), password);
  await user.type(screen.getByLabelText("再輸入一次密碼"), password);
  return user;
}
describe("learner enrollment and recovery screens", () => {
  it("fails closed without provider configuration", () => {
    render(<LearnerAuthPage config={null} mode="signup" />);
    expect(screen.getByText(/帳號服務尚未完成設定/)).toBeTruthy(); expect(screen.queryByRole("button")).toBeNull();
  });
  it("validates confirmation, enrolls and clears both password fields", async () => {
    render(<LearnerAuthPage config={config} mode="signup" />); const user = await fields();
    await user.clear(screen.getByLabelText("再輸入一次密碼")); await user.type(screen.getByLabelText("再輸入一次密碼"), "different-password");
    await user.click(screen.getByRole("button", { name: "建立帳號並寄送確認信" }));
    expect(mock.auth!.signUp).not.toHaveBeenCalled(); expect(screen.getByRole("alert").textContent).toMatch(/密碼不同/);
    await user.clear(screen.getByLabelText("再輸入一次密碼")); await user.type(screen.getByLabelText("再輸入一次密碼"), password);
    await user.click(screen.getByRole("button", { name: "建立帳號並寄送確認信" }));
    expect(mock.auth!.signUp).toHaveBeenCalledWith("learner@example.invalid", password);
    expect(screen.getByRole("status").textContent).toMatch(/如果這個地址可以註冊/);
    expect((screen.getByLabelText("密碼") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("再輸入一次密碼") as HTMLInputElement).value).toBe("");
    expect(localStorage.length + sessionStorage.length).toBe(0);
  });
  it("supports resend with no password and masks raw provider errors", async () => {
    mock.auth!.resendConfirmation = vi.fn(async () => { throw new Error("SECRET provider detail"); });
    render(<LearnerAuthPage config={config} mode="signup" />); const user = userEvent.setup();
    await user.type(await screen.findByLabelText("電子郵件"), "learner@example.invalid");
    await user.click(screen.getByRole("button", { name: "重新寄送確認信" }));
    expect(mock.auth!.resendConfirmation).toHaveBeenCalledWith("learner@example.invalid");
    expect(screen.getByRole("alert").textContent).toMatch(/無法完成/); expect(screen.queryByText(/SECRET/)).toBeNull();
  });
  it("submits generic recovery and blocks repeated clicks while pending", async () => {
    let finish = () => {}; mock.auth!.requestPasswordReset = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    render(<LearnerAuthPage config={config} mode="recover" />); const user = userEvent.setup();
    await user.type(await screen.findByLabelText("電子郵件"), "learner@example.invalid");
    await user.dblClick(screen.getByRole("button", { name: "寄送密碼重設信" }));
    expect(mock.auth!.requestPasswordReset).toHaveBeenCalledTimes(1);
    await act(async () => finish()); expect(screen.getByRole("status").textContent).toMatch(/不代表帳號是否存在/);
  });
  it("strips callback tokens and arbitrary query before verifying, then updates the verified email", async () => {
    window.history.replaceState(null, "", "/account/auth-return?next=https://evil.invalid#synthetic-secret-fragment");
    mock.auth!.acceptEmailLink = vi.fn(async (fragment) => {
      expect(fragment).toBe("#synthetic-secret-fragment"); expect(window.location.hash + window.location.search).toBe("");
      return { kind: "recovery" as const, email: "learner@example.invalid" };
    });
    render(<LearnerAuthPage config={config} mode="return" />); const user = userEvent.setup();
    await user.type(await screen.findByLabelText("新密碼"), password);
    await user.type(screen.getByLabelText("再輸入一次密碼"), password);
    expect(screen.getByText("learner@example.invalid")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "儲存新密碼" }));
    expect(mock.auth!.updatePassword).toHaveBeenCalledWith(password);
    expect(screen.getByRole("status").textContent).toMatch(/密碼已更新/); expect(screen.queryByLabelText("新密碼")).toBeNull();
    expect(localStorage.length + sessionStorage.length).toBe(0);
  });
  it("an expired callback gives new-link choices without a password form", async () => {
    mock.auth!.acceptEmailLink = vi.fn(async () => { throw new LearnerAuthError("INVALID_LINK"); });
    render(<LearnerAuthPage config={config} mode="return" />);
    expect((await screen.findByRole("alert")).textContent).toMatch(/連結已失效/);
    expect(screen.queryByLabelText("新密碼")).toBeNull();
    expect(screen.getByRole("link", { name: "重新申請重設信" }).getAttribute("href")).toBe("/account/recover");
  });
  it("confirmed signup offers login without importing a recovery session or library", async () => {
    mock.auth!.acceptEmailLink = vi.fn(async () => ({ kind: "signup" as const, email: "learner@example.invalid" }));
    render(<LearnerAuthPage config={config} mode="return" />);
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/電子郵件已確認/));
    expect(screen.queryByLabelText("新密碼")).toBeNull(); expect(mock.auth!.updatePassword).not.toHaveBeenCalled();
  });
  it("disposes credentials on navigation and erases password DOM on pagehide", async () => {
    const { unmount } = render(<LearnerAuthPage config={config} mode="signup" />); await fields();
    act(() => { window.dispatchEvent(new PageTransitionEvent("pagehide")); });
    expect((screen.getByLabelText("密碼") as HTMLInputElement).value).toBe("");
    expect(mock.auth!.dispose).toHaveBeenCalled(); unmount();
  });
  it("clears signup password state and disposes when navigating to recovery", async () => {
    const { rerender } = render(<LearnerAuthPage config={config} mode="signup" />); await fields();
    rerender(<LearnerAuthPage config={config} mode="recover" />);
    await waitFor(() => expect((screen.getByLabelText("電子郵件") as HTMLInputElement).disabled).toBe(false));
    expect((screen.getByLabelText("電子郵件") as HTMLInputElement).value).toBe("");
    expect(screen.queryByLabelText("密碼")).toBeNull(); expect(mock.auth!.dispose).toHaveBeenCalled();
  });
  it("does not lose the callback fragment during Strict Mode cleanup", async () => {
    window.history.replaceState(null, "", "/account/auth-return#synthetic");
    render(<StrictMode><LearnerAuthPage config={config} mode="return" /></StrictMode>);
    await screen.findByLabelText("新密碼");
    expect(vi.mocked(mock.auth!.acceptEmailLink).mock.calls.every(([value]) => value === "#synthetic")).toBe(true);
  });
});
