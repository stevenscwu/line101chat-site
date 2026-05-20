export type TranslationPlanId = "free" | "basic" | "plus";

export type TranslationPlan = {
  id: TranslationPlanId;
  name: string;
  amount: number;
  currency: "TWD";
  translations: number;
  billingLabel: string;
  paid: boolean;
};

export const translationPlans = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    currency: "TWD",
    translations: 30,
    billingLabel: "NT$0",
    paid: false,
  },
  basic: {
    id: "basic",
    name: "Basic",
    amount: 99,
    currency: "TWD",
    translations: 300,
    billingLabel: "NT$99 / month",
    paid: true,
  },
  plus: {
    id: "plus",
    name: "Plus",
    amount: 199,
    currency: "TWD",
    translations: 1000,
    billingLabel: "NT$199 / month",
    paid: true,
  },
} satisfies Record<TranslationPlanId, TranslationPlan>;

export const paidTranslationPlanIds = ["basic", "plus"] as const;

export type PaidTranslationPlanId = (typeof paidTranslationPlanIds)[number];

export function getPaidTranslationPlan(plan: string | null | undefined): TranslationPlan | null {
  if (plan === "basic" || plan === "plus") {
    return translationPlans[plan];
  }

  return null;
}
