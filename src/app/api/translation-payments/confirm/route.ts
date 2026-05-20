import { NextResponse } from "next/server";

import {
  confirmLinePayPayment,
  verifyLinePayConfirmInfo,
} from "@/lib/translation-payments/line-pay";
import {
  findPaymentOrder,
  markPaymentPaid,
  updatePaymentOrder,
} from "@/lib/translation-payments/store";

export const runtime = "nodejs";

function redirectToService(request: Request, status: string, orderId?: string) {
  const url = new URL("/translation-service", request.url);
  url.searchParams.set("payment", status);

  if (orderId) {
    url.searchParams.set("orderId", orderId);
  }

  return NextResponse.redirect(url, { status: 303 });
}

function statusFromLinePayReturnCode(returnCode: string) {
  if (returnCode === "0121" || returnCode === "1180") {
    return "cancelled" as const;
  }

  if (returnCode === "1145" || returnCode === "1198") {
    return "pending" as const;
  }

  return "failed" as const;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const orderId = requestUrl.searchParams.get("orderId");
  const transactionIdFromLinePay = requestUrl.searchParams.get("transactionId");

  const order =
    (orderId ? await findPaymentOrder({ orderId }) : null) ??
    (transactionIdFromLinePay
      ? await findPaymentOrder({ transactionId: transactionIdFromLinePay })
      : null);

  if (!order) {
    return redirectToService(request, "not-found");
  }

  const transactionId = transactionIdFromLinePay ?? order.transactionId;

  if (!transactionId) {
    return redirectToService(request, "missing-transaction", order.orderId);
  }

  if (order.transactionId && order.transactionId !== transactionId) {
    return redirectToService(request, "transaction-mismatch", order.orderId);
  }

  if (order.status === "paid") {
    return redirectToService(request, "paid", order.orderId);
  }

  try {
    const linePayResponse = await confirmLinePayPayment(order, transactionId);

    if (linePayResponse.returnCode === "0000") {
      const verification = verifyLinePayConfirmInfo(
        {
          ...order,
          transactionId,
        },
        linePayResponse.info,
      );

      if (!verification.ok) {
        await updatePaymentOrder(order.orderId, {
          status: "failed",
          transactionId,
          failedAt: new Date().toISOString(),
          lastLinePayReturnCode: "VERIFY_FAILED",
          lastLinePayReturnMessage: verification.reasons.join(" "),
        });

        return redirectToService(request, "verification-failed", order.orderId);
      }

      await markPaymentPaid(
        {
          ...order,
          transactionId,
        },
        {
          transactionId,
          lastLinePayReturnCode: linePayResponse.returnCode,
          lastLinePayReturnMessage: linePayResponse.returnMessage,
        },
      );

      return redirectToService(request, "paid", order.orderId);
    }

    const nextStatus = statusFromLinePayReturnCode(linePayResponse.returnCode);

    await updatePaymentOrder(order.orderId, {
      status: nextStatus,
      transactionId,
      failedAt: nextStatus === "failed" ? new Date().toISOString() : order.failedAt,
      cancelledAt: nextStatus === "cancelled" ? new Date().toISOString() : order.cancelledAt,
      lastLinePayReturnCode: linePayResponse.returnCode,
      lastLinePayReturnMessage: linePayResponse.returnMessage,
    });

    return redirectToService(request, nextStatus, order.orderId);
  } catch (error) {
    await updatePaymentOrder(order.orderId, {
      transactionId,
      lastLinePayReturnCode: "LOCAL_ERROR",
      lastLinePayReturnMessage: (error as Error).message,
    });

    return redirectToService(request, "confirm-error", order.orderId);
  }
}
