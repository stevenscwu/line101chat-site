import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

import { translationPlans, type TranslationPlanId } from "@/lib/translation-payments/plans";

export type TranslationPaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type TranslationPaymentOrder = {
  orderId: string;
  lineUserId: string;
  plan: Exclude<TranslationPlanId, "free">;
  planName: string;
  quota: number;
  amount: number;
  currency: "TWD";
  status: TranslationPaymentStatus;
  transactionId: string | null;
  paymentUrl: string | null;
  activationCode: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  lastLinePayReturnCode: string | null;
  lastLinePayReturnMessage: string | null;
  lastReconciledAt: string | null;
};

type TranslationPaymentPatch = Partial<
  Omit<TranslationPaymentOrder, "orderId" | "createdAt">
>;

type StoreFile = {
  payments: TranslationPaymentOrder[];
};

const dataDirectory =
  process.env.TRANSLATION_PAYMENTS_DATA_DIR ??
  (process.env.VERCEL
    ? path.join(os.tmpdir(), "line101chat-site")
    : path.join(process.cwd(), ".data"));

const storePath = path.join(dataDirectory, "translation-payments.json");

let writeLock = Promise.resolve();

function nowIso() {
  return new Date().toISOString();
}

async function ensureStoreDirectory() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;

    if (!Array.isArray(parsed.payments)) {
      return { payments: [] };
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { payments: [] };
    }

    throw error;
  }
}

async function writeStore(store: StoreFile) {
  await ensureStoreDirectory();

  const tempPath = `${storePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, storePath);
}

async function withWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const next = writeLock.then(task, task);
  writeLock = next.then(
    () => undefined,
    () => undefined,
  );

  return next;
}

export function createTranslationOrderId() {
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  return `L101T-${timestamp}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function createActivationCode() {
  return `TR-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
}

export async function createPaymentOrder(input: {
  orderId: string;
  lineUserId: string;
  plan: "basic" | "plus";
}): Promise<TranslationPaymentOrder> {
  const plan = translationPlans[input.plan];
  const timestamp = nowIso();

  const payment: TranslationPaymentOrder = {
    orderId: input.orderId,
    lineUserId: input.lineUserId,
    plan: input.plan,
    planName: plan.name,
    quota: plan.translations,
    amount: plan.amount,
    currency: plan.currency,
    status: "pending",
    transactionId: null,
    paymentUrl: null,
    activationCode: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    paidAt: null,
    failedAt: null,
    cancelledAt: null,
    lastLinePayReturnCode: null,
    lastLinePayReturnMessage: null,
    lastReconciledAt: null,
  };

  return withWriteLock(async () => {
    const store = await readStore();
    store.payments.unshift(payment);
    await writeStore(store);
    return payment;
  });
}

export async function listPaymentOrders(): Promise<TranslationPaymentOrder[]> {
  const store = await readStore();

  return [...store.payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findPaymentOrder(
  locator: { orderId: string } | { transactionId: string },
): Promise<TranslationPaymentOrder | null> {
  const store = await readStore();

  if ("orderId" in locator) {
    return store.payments.find((payment) => payment.orderId === locator.orderId) ?? null;
  }

  return store.payments.find((payment) => payment.transactionId === locator.transactionId) ?? null;
}

export async function updatePaymentOrder(
  orderId: string,
  patch: TranslationPaymentPatch,
): Promise<TranslationPaymentOrder | null> {
  return withWriteLock(async () => {
    const store = await readStore();
    const index = store.payments.findIndex((payment) => payment.orderId === orderId);

    if (index === -1) {
      return null;
    }

    const updated: TranslationPaymentOrder = {
      ...store.payments[index],
      ...patch,
      updatedAt: nowIso(),
    };

    store.payments[index] = updated;
    await writeStore(store);

    return updated;
  });
}

export async function markPaymentPaid(
  order: TranslationPaymentOrder,
  patch: TranslationPaymentPatch = {},
): Promise<TranslationPaymentOrder | null> {
  return updatePaymentOrder(order.orderId, {
    ...patch,
    status: "paid",
    activationCode: order.activationCode ?? createActivationCode(),
    paidAt: order.paidAt ?? nowIso(),
    failedAt: null,
    cancelledAt: null,
  });
}
