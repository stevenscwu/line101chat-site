import { NextResponse } from "next/server";

import { getPaidTranslationPlan } from "@/lib/translation-payments/plans";
import {
  createPaymentOrder,
  createTranslationOrderId,
  updatePaymentOrder,
} from "@/lib/translation-payments/store";
import { requestLinePayPayment } from "@/lib/translation-payments/line-pay";

export const runtime = "nodejs";

type CreatePaymentPayload = {
  plan?: string;
  lineUserId?: string;
};

function isLineUserId(value: string) {
  return value.length >= 4 && value.length <= 128 && /^[A-Za-z0-9._:-]+$/.test(value);
}

async function readPayload(request: Request): Promise<CreatePaymentPayload> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as CreatePaymentPayload;
  }

  const formData = await request.formData();

  return {
    plan: String(formData.get("plan") ?? ""),
    lineUserId: String(formData.get("lineUserId") ?? ""),
  };
}

function wantsHtmlRedirect(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "";

  return !contentType.includes("application/json") && accept.includes("text/html");
}

function redirectToService(request: Request, status: string, orderId?: string) {
  const url = new URL("/translation-service", request.url);
  url.searchParams.set("payment", status);

  if (orderId) {
    url.searchParams.set("orderId", orderId);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const payload = await readPayload(request);
  const plan = getPaidTranslationPlan(payload.plan);
  const lineUserId = payload.lineUserId?.trim() ?? "";
  const htmlRedirect = wantsHtmlRedirect(request);

  if (!plan || plan.id === "free") {
    if (htmlRedirect) {
      return redirectToService(request, "invalid-plan");
    }

    return NextResponse.json({ error: "A paid plan is required." }, { status: 400 });
  }

  if (!isLineUserId(lineUserId)) {
    if (htmlRedirect) {
      return redirectToService(request, "missing-line-user");
    }

    return NextResponse.json(
      { error: "A valid LINE userId is required before payment." },
      { status: 400 },
    );
  }

  const order = await createPaymentOrder({
    orderId: createTranslationOrderId(),
    lineUserId,
    plan: plan.id,
  });

  try {
    const linePayResponse = await requestLinePayPayment(order);

    if (linePayResponse.returnCode !== "0000" || !linePayResponse.info?.transactionId) {
      await updatePaymentOrder(order.orderId, {
        status: "failed",
        failedAt: new Date().toISOString(),
        lastLinePayReturnCode: linePayResponse.returnCode,
        lastLinePayReturnMessage: linePayResponse.returnMessage,
      });

      if (htmlRedirect) {
        return redirectToService(request, "request-failed", order.orderId);
      }

      return NextResponse.json(
        {
          error: "LINE Pay payment request failed.",
          orderId: order.orderId,
          returnCode: linePayResponse.returnCode,
          returnMessage: linePayResponse.returnMessage,
        },
        { status: 502 },
      );
    }

    const transactionId = String(linePayResponse.info.transactionId);
    const paymentUrl =
      linePayResponse.info.paymentUrl?.web ?? linePayResponse.info.paymentUrl?.app ?? null;

    if (!paymentUrl) {
      await updatePaymentOrder(order.orderId, {
        status: "failed",
        transactionId,
        failedAt: new Date().toISOString(),
        lastLinePayReturnCode: linePayResponse.returnCode,
        lastLinePayReturnMessage: "LINE Pay did not return a paymentUrl.",
      });

      if (htmlRedirect) {
        return redirectToService(request, "request-failed", order.orderId);
      }

      return NextResponse.json(
        { error: "LINE Pay did not return a payment URL.", orderId: order.orderId },
        { status: 502 },
      );
    }

    await updatePaymentOrder(order.orderId, {
      transactionId,
      paymentUrl,
      lastLinePayReturnCode: linePayResponse.returnCode,
      lastLinePayReturnMessage: linePayResponse.returnMessage,
    });

    if (htmlRedirect) {
      return NextResponse.redirect(paymentUrl, { status: 303 });
    }

    return NextResponse.json({
      orderId: order.orderId,
      transactionId,
      paymentUrl,
      status: "pending",
    });
  } catch (error) {
    await updatePaymentOrder(order.orderId, {
      status: "failed",
      failedAt: new Date().toISOString(),
      lastLinePayReturnCode: "LOCAL_ERROR",
      lastLinePayReturnMessage: (error as Error).message,
    });

    if (htmlRedirect) {
      return redirectToService(request, "request-error", order.orderId);
    }

    return NextResponse.json(
      {
        error: "Unable to create LINE Pay payment.",
        orderId: order.orderId,
        detail: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
