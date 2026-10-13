"use client";

import type { ComponentType } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  ScanSearch,
  Settings,
  UserRound,
  WandSparkles,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  available: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    available: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    available: true,
  },
  {
    label: "Resume",
    href: "/resume",
    icon: FileText,
    available: true,
  },
  {
    label: "ATS Score",
    href: "/ats-score",
    icon: ScanSearch,
    available: true,
  },
  {
    label: "Resume Optimizer",
    href: "/resume-optimizer",
    icon: WandSparkles,
    available: true,
  },
  {
    label: "Job Match",
    href: "/job-match",
    icon: BriefcaseBusiness,
    available: true,
  },
  {
    label: "AI Assistant",
    href: "/assistant",
    icon: Bot,
    available: false,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    available: false,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-sidebar sticky top-5 hidden h-[calc(100vh-2.5rem)] w-72 shrink-0 overflow-hidden rounded-[2rem] border border-white/20 text-white shadow-[0_24px_80px_rgba(2,12,27,0.35)] lg:flex lg:flex-col">
      {/* Brand */}
      <div className="shrink-0 border-b border-white/10 px-7 py-7">
        <Link
          href="/dashboard"
          className="block text-lg font-semibold uppercase tracking-[0.18em] text-white transition hover:text-white/85"
        >
          Career Match
          <span className="ml-1 text-white/70">AI</span>
        </Link>

        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
          AI Career Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex min-h-0 flex-1 flex-col justify-center space-y-2 px-4 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          if (!item.available) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex min-h-14 cursor-not-allowed items-center justify-between rounded-2xl px-4 py-3 text-sm text-white/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />

                  <span className="truncate uppercase tracking-[0.08em]">
                    {item.label}
                  </span>
                </div>

                <span className="ml-3 shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium uppercase tracking-[0.08em] transition duration-200 ${
                isActive
                  ? "border border-white/20 bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_30px_rgba(5,18,38,0.18)] backdrop-blur-xl"
                  : "border border-transparent text-white/75 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition ${
                  isActive
                    ? "text-white"
                    : "text-white/65 group-hover:text-white"
                }`}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}