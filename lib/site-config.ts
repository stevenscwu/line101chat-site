import { Route } from "next";

export interface NavItem {
  href: Route;
  label: string;
  shortLabel?: string;
}

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "首頁", shortLabel: "首頁" },
  { href: "/dashboard", label: "儀表板", shortLabel: "儀表板" },
  { href: "/learn", label: "學習路徑", shortLabel: "路徑" },
  { href: "/pronunciation", label: "發音練習", shortLabel: "發音" },
  { href: "/vocabulary", label: "單字複習", shortLabel: "單字" },
  { href: "/materials", label: "學習素材", shortLabel: "素材" },
  { href: "/journal", label: "學習日誌", shortLabel: "日誌" },
  { href: "/social-ideas", label: "社群靈感", shortLabel: "社群" },
  { href: "/achievements", label: "成就牆", shortLabel: "成就" },
  { href: "/about", label: "關於計畫", shortLabel: "關於" },
  { href: "/settings", label: "設定", shortLabel: "設定" }
];
