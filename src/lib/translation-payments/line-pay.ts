import { createHmac, randomUUID } from "crypto";

import type { TranslationPaymentOrder } from "@/lib/translation-payments/store";

type LinePayConfig = {
  channelId: string;
  channelSecret: string;
  apiBaseUrl: string;
  confirmUrl: string;
  cancelUrl: string;
};

type LinePayApiResponse<TInfo> = {
  returnCode: string;
  returnMessage: string;
  info?: TInfo;
};

type LinePayPaymentRequestInfo = {
  paymentUrl?: {
    web?: string;
    app?: string;
  };
  transactionId?: string | number;
  paymentAccessToken?: string;
};

export type LinePayConfirmInfo = {
  orderId?: string;
  transactionId?: string | number;
  currency?: string;
  payInfo?: Array<{
    method?: string;
    amount?: number;
  }>;
};

export type LinePayPaymentDetail = {
  orderId?: string;
  transactionId?: string | number;
  transactionType?: string;
  currency?: string;
  payInfo?: Array<{
    method?: string;
    amount?: number;
  }>;
  packages?: Array<{
    id?: string;
    amount?: number;
    userFeeAmount?: number;
  }>;
};

export type PaymentVerification = {
  ok: boolean;
  reasons: string[];
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function getLinePayConfig(): LinePayConfig {
  return {
    channelId: getRequiredEnv("LINE_PAY_CHANNEL_ID"),
    channelSecret: getRequiredEnv("LINE_PAY_CHANNEL_SECRET"),
    apiBaseUrl: getRequiredEnv("LINE_PAY_API_BASE_URL").replace(/\/$/, ""),
    confirmUrl: getRequiredEnv("LINE_PAY_CONFIRM_URL"),
    cancelUrl: getRequiredEnv("LINE_PAY_CANCEL_URL"),
  };
}

function signLinePayMessage(channelSecret: string, message: string) {
  return createHmac("sha256", channelSecret).update(message).digest("base64");
}

function parseLinePayJson<T>(text: string): T {
  const processedText = text.replace(/:\s*(\d{16,})\b/g, ': "$1"');
  return JSON.parse(processedText) as T;
}

function appendSearchParams(rawUrl: string, params: Record<string, string>) {
  const url = new URL(rawUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

async function requestLinePayApi<TInfo>({
  method,
  apiPath,
  body,
  queryString = "",
}: {
  method: "GET" | "POST";
  apiPath: string;
  body?: unknown;
  queryString?: string;
}) {
  const config = getLinePayConfig();
  const nonce = randomUUID();
  const bodyText = body === undefined ? "" : JSON.stringify(body);
  const signatureBase =
    method === "GET"
      ? `${config.channelSecret}${apiPath}${queryString}${nonce}`
      : `${config.channelSecret}${apiPath}${bodyText}${nonce}`;
  const signature = signLinePayMessage(config.channelSecret, signatureBase);

  const response = await fetch(`${config.apiBaseUrl}${apiPath}${queryString}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-LINE-ChannelId": config.channelId,
      "X-LINE-Authorization-Nonce": nonce,
      "X-LINE-Authorization": signature,
    },
    body: method === "POST" ? bodyText : undefined,
    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`LINE Pay API HTTP ${response.status}: ${text.slice(0, 160)}`);
  }

  return parseLinePayJson<LinePayApiResponse<TInfo>>(text);
}

export function getPaymentRedirectUrls(orderId: string) {
  const config = getLinePayConfig();

  return {
    confirmUrl: appendSearchParams(config.confirmUrl, { orderId }),
    cancelUrl: appendSearchParams(config.cancelUrl, { orderId }),
  };
}

export async function requestLinePayPayment(order: TranslationPaymentOrder) {
  const redirectUrls = getPaymentRedirectUrls(order.orderId);

  return requestLinePayApi<LinePayPaymentRequestInfo>({
    method: "POST",
    apiPath: "/v3/payments/request",
    body: {
      amount: order.amount,
      currency: order.currency,
      orderId: order.orderId,
      packages: [
        {
          id: `translation-${order.plan}`,
          amount: order.amount,
          products: [
            {
              id: `line101chat-translation-${order.plan}`,
              name: `LINE101Chat Translation Bot ${order.planName}`,
              quantity: 1,
              price: order.amount,
            },
          ],
        },
      ],
      redirectUrls,
    },
  });
}

export async function confirmLinePayPayment(order: TranslationPaymentOrder, transactionId: string) {
  return requestLinePayApi<LinePayConfirmInfo>({
    method: "POST",
    apiPath: `/v3/payments/${encodeURIComponent(transactionId)}/confirm`,
    body: {
      amount: order.amount,
      currency: order.currency,
    },
  });
}

export async function retrieveLinePayPaymentDetails(locator: {
  orderId?: string;
  transactionId?: string;
}) {
  const params = new URLSearchParams();

  if (locator.orderId) {
    params.set("orderId", locator.orderId);
  }

  if (locator.transactionId) {
    params.set("transactionId", locator.transactionId);
  }

  return requestLinePayApi<LinePayPaymentDetail[]>({
    method: "GET",
    apiPath: "/v3/payments",
    queryString: `?${params.toString()}`,
  });
}

function sumPayInfoAmount(payInfo: LinePayConfirmInfo["payInfo"]) {
  if (!payInfo?.length) {
    return null;
  }

  return payInfo.reduce((total, item) => total + (typeof item.amount === "number" ? item.amount : 0), 0);
}

function sumPackageAmount(packages: LinePayPaymentDetail["packages"]) {
  if (!packages?.length) {
    return null;
  }

  return packages.reduce((total, item) => {
    const amount = typeof item.amount === "number" ? item.amount : 0;
    const userFeeAmount = typeof item.userFeeAmount === "number" ? item.userFeeAmount : 0;
    return total + amount + userFeeAmount;
  }, 0);
}

export function verifyLinePayConfirmInfo(
  order: TranslationPaymentOrder,
  info: LinePayConfirmInfo | undefined,
): PaymentVerification {
  const reasons: string[] = [];

  if (!info) {
    reasons.push("LINE Pay did not return confirmation details.");
  }

  if (info?.orderId && info.orderId !== order.orderId) {
    reasons.push("LINE Pay orderId does not match the local order.");
  }

  if (info?.transactionId && String(info.transactionId) !== order.transactionId) {
    reasons.push("LINE Pay transactionId does not match the local order.");
  }

  if (info?.currency && info.currency !== order.currency) {
    reasons.push("LINE Pay currency does not match the local order.");
  }

  const paidAmount = sumPayInfoAmount(info?.payInfo);

  if (paidAmount !== null && paidAmount !== order.amount) {
    reasons.push("LINE Pay paid amount does not match the local order.");
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}

export function verifyLinePayPaymentDetail(
  order: TranslationPaymentOrder,
  detail: LinePayPaymentDetail | undefined,
): PaymentVerification {
  const reasons: string[] = [];

  if (!detail) {
    reasons.push("LINE Pay payment detail was not found.");
  }

  if (detail?.orderId !== order.orderId) {
    reasons.push("LINE Pay orderId does not match the local order.");
  }

  if (detail?.transactionId && String(detail.transactionId) !== order.transactionId) {
    reasons.push("LINE Pay transactionId does not match the local order.");
  }

  if (detail?.currency && detail.currency !== order.currency) {
    reasons.push("LINE Pay currency does not match the local order.");
  }

  if (detail?.transactionType && detail.transactionType !== "PAYMENT") {
    reasons.push("LINE Pay transaction type is not PAYMENT.");
  }

  const paidAmount = sumPayInfoAmount(detail?.payInfo) ?? sumPackageAmount(detail?.packages);

  if (paidAmount !== null && paidAmount !== order.amount) {
    reasons.push("LINE Pay paid amount does not match the local order.");
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}
