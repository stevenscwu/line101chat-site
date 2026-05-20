import { NextResponse } from "next/server";

import { isTranslationPaymentAdminAllowed } from "@/lib/translation-payments/admin";
import {
  retrieveLinePayPaymentDetails,
  verifyLinePayPaymentDetail,
} from "@/lib/translation-payments/line-pay";
import {
  findPaymentOrder,
  markPaymentPaid,
  updatePaymentOrder,
} from "@/lib/translation-payments/store";

export const runtime = "nodejs";

type ReconcilePayload = {
  orderId?: string;
  transactionId?: string;
  adminToken?: string;
  returnTo?: string;
};

async function readPayload(request: Request): Promise<ReconcilePayload> {
  const contentType = request.headers.get("content-type") ?? "";
  const requestUrl = new URL(request.url);

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as ReconcilePayload;
    return {
      ...json,
      adminToken:
        json.adminToken ??
        request.headers.get("x-admin-token") ??
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
        requestUrl.searchParams.get("token") ??
        undefined,
    };
  }

  const formData = await request.formData();

  return {
    orderId: String(formData.get("orderId") ?? requestUrl.searchParams.get("orderId") ?? ""),
    transactionId: String(
      formData.get("transactionId") ?? requestUrl.searchParams.get("transactionId") ?? "",
    ),
    adminToken: String(formData.get("adminToken") ?? requestUrl.searchParams.get("token") ?? ""),
    returnTo: String(formData.get("returnTo") ?? ""),
  };
}

function wantsHtmlRedirect(request: Request, payload: ReconcilePayload) {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "";

  return Boolean(payload.returnTo) || (!contentType.includes("application/json") && accept.includes("text/html"));
}

function redirectAfterRecheck(request: Request, payload: ReconcilePayload, status: string) {
  const url = payload.returnTo
    ? new URL(payload.returnTo, request.url)
    : new URL("/translation-service/admin", request.url);

  url.searchParams.set("reconcile", status);

  if (payload.orderId) {
    url.searchParams.set("orderId", payload.orderId);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const payload = await readPayload(request);
  const htmlRedirect = wantsHtmlRedirect(request, payload);

  if (!isTranslationPaymentAdminAllowed(payload.adminToken)) {
    if (htmlRedirect) {
      return redirectAfterRecheck(request, payload, "unauthorized");
    }

    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const orderId = payload.orderId?.trim();
  const transactionId = payload.transactionId?.trim();

  if (!orderId && !transactionId) {
    if (htmlRedirect) {
      return redirectAfterRecheck(request, payload, "missing-locator");
    }

    return NextResponse.json(
      { error: "Provide orderId or transactionId to reconcile." },
      { status: 400 },
    );
  }

  const order =
    (orderId ? await findPaymentOrder({ orderId }) : null) ??
    (transactionId ? await findPaymentOrder({ transactionId }) : null);

  if (!order) {
    if (htmlRedirect) {
      return redirectAfterRecheck(request, payload, "not-found");
    }

    return NextResponse.json({ error: "Local payment order not found." }, { status: 404 });
  }

  try {
    const linePayResponse = await retrieveLinePayPaymentDetails({
      orderId: order.orderId,
      transactionId: transactionId ?? order.transactionId ?? undefined,
    });

    const matchedDetail = linePayResponse.info?.find((detail) => {
      const detailTransactionId = detail.transactionId ? String(detail.transactionId) : null;
      return (
        detail.orderId === order.orderId &&
        (!order.transactionId || detailTransactionId === order.transactionId)
      );
    });

    const verification = verifyLinePayPaymentDetail(order, matchedDetail);
    const timestamp = new Date().toISOString();

    if (linePayResponse.returnCode === "0000" && verification.ok) {
      const paidOrder = await markPaymentPaid(order, {
        transactionId: order.transactionId ?? (matchedDetail?.transactionId ? String(matchedDetail.transactionId) : null),
        lastLinePayReturnCode: linePayResponse.returnCode,
        lastLinePayReturnMessage: linePayResponse.returnMessage,
        lastReconciledAt: timestamp,
      });

      if (htmlRedirect) {
        return redirectAfterRecheck(request, payload, "paid");
      }

      return NextResponse.json({
        status: "paid",
        order: paidOrder,
        verification,
      });
    }

    await updatePaymentOrder(order.orderId, {
      status: linePayResponse.returnCode === "0000" ? order.status : "pending",
      lastLinePayReturnCode: linePayResponse.returnCode,
      lastLinePayReturnMessage:
        linePayResponse.returnCode === "0000"
          ? verification.reasons.join(" ")
          : linePayResponse.returnMessage,
      lastReconciledAt: timestamp,
    });

    if (htmlRedirect) {
      return redirectAfterRecheck(request, payload, "not-paid");
    }

    return NextResponse.json({
      status: "not-paid",
      returnCode: linePayResponse.returnCode,
      returnMessage: linePayResponse.returnMessage,
      verification,
    });
  } catch (error) {
    await updatePaymentOrder(order.orderId, {
      lastLinePayReturnCode: "LOCAL_ERROR",
      lastLinePayReturnMessage: (error as Error).message,
      lastReconciledAt: new Date().toISOString(),
    });

    if (htmlRedirect) {
      return redirectAfterRecheck(request, payload, "error");
    }

    return NextResponse.json(
      {
        error: "Unable to reconcile LINE Pay payment.",
        detail: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
