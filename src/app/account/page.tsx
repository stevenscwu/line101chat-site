import type { Metadata } from "next";
import { AccountLibraryPage } from "@/components/account-library-page";
import { readSupabaseAccountConfig } from "@/lib/server/supabase-account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "說日語・個人教材庫", robots: { index: false, follow: false },
  description: "登入你的私人日語教材庫。選擇教材、先預覽，再決定是否上傳。",
};

export default function AccountPage() {
  // Only the project origin and publishable key can cross this server boundary.
  return <AccountLibraryPage config={readSupabaseAccountConfig()} />;
}
