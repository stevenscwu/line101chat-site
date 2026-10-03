import type { Metadata } from "next";
import { LearnerAuthPage } from "@/components/learner-auth-page";
import { readSupabaseAccountConfig } from "@/lib/server/supabase-account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "說日語・建立學員帳號", robots: { index: false, follow: false } };
export default function Page() { return <LearnerAuthPage config={readSupabaseAccountConfig()} mode="signup" />; }
