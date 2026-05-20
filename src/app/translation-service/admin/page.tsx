import type { Metadata } from "next";
import { RefreshCcw, ShieldCheck } from "lucide-react";

import {
  isTranslationPaymentAdminAllowed,
  isTranslationPaymentAdminConfigured,
} from "@/lib/translation-payments/admin";
import { listPaymentOrders } from "@/lib/translation-payments/store";

export const metadata: Metadata = {
  title: "Translation Payments Admin｜LINE101Chat",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Taipei",
  }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "paid") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "failed" || status === "cancelled") {
    return "bg-rose-100 text-rose-800";
  }

  return "bg-amber-100 text-amber-800";
}

export default async function TranslationPaymentsAdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const adminToken = firstParam(params.token) ?? "";
  const reconcileStatus = firstParam(params.reconcile);
  const isConfigured = isTranslationPaymentAdminConfigured();
  const isAllowed = isTranslationPaymentAdminAllowed(adminToken);

  if (!isAllowed) {
    return (
      <main className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-slate-600" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-black text-slate-950">Admin access required</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {isConfigured
              ? "Open this page with the configured admin token to view payment records and recheck payments."
              : "Set TRANSLATION_PAYMENTS_ADMIN_TOKEN in production before exposing the payments admin table."}
          </p>
        </div>
      </main>
    );
  }

  const payments = await listPaymentOrders();
  const returnTo = `/translation-service/admin${adminToken ? `?token=${encodeURIComponent(adminToken)}` : ""}`;

  return (
    <main className="bg-slate-50 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              Admin
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[0] text-slate-950">
              Translation payments
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Recheck only calls the server-side LINE Pay payment details API. Quota is never activated from a client-side redirect alone.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
            {payments.length} records
          </div>
        </div>

        {reconcileStatus ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700">
            Recheck result: <span className="font-mono">{reconcileStatus}</span>
          </div>
        ) : null}

        <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-[0.06em] text-slate-500">
              <tr>
                <th className="px-4 py-3">orderId</th>
                <th className="px-4 py-3">lineUserId</th>
                <th className="px-4 py-3">plan</th>
                <th className="px-4 py-3">amount</th>
                <th className="px-4 py-3">status</th>
                <th className="px-4 py-3">transactionId</th>
                <th className="px-4 py-3">activationCode</th>
                <th className="px-4 py-3">createdAt</th>
                <th className="px-4 py-3">paidAt</th>
                <th className="px-4 py-3">action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((payment) => (
                <tr key={payment.orderId} className="align-top">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{payment.orderId}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{payment.lineUserId}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{payment.planName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">
                    {payment.currency} {payment.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-1 text-xs font-black ${statusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">
                    {payment.transactionId ?? "-"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">
                    {payment.activationCode ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatDate(payment.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{formatDate(payment.paidAt)}</td>
                  <td className="px-4 py-3">
                    <form action="/api/translation-payments/reconcile" method="post">
                      <input type="hidden" name="orderId" value={payment.orderId} />
                      <input type="hidden" name="transactionId" value={payment.transactionId ?? ""} />
                      <input type="hidden" name="adminToken" value={adminToken} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <button
                        type="submit"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
                      >
                        <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        Recheck payment
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm font-bold text-slate-500">
                    No translation payment orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
