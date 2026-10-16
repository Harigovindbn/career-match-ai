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
    href: "/ai-assistant",
    icon: Bot,
    available: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    available: true,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-72 shrink-0 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl lg:flex lg:flex-col">
      {/* Brand */}
      <div className="shrink-0 border-b border-[var(--border)] px-7 py-7">
        <Link
          href="/dashboard"
          className="block text-lg font-bold uppercase tracking-[0.18em] text-[var(--foreground)] transition hover:text-[var(--primary)]"
        >
          Career Match
          <span className="ml-1 text-[var(--primary)]">AI</span>
        </Link>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
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
                className="flex min-h-14 cursor-not-allowed items-center justify-between rounded-2xl px-4 py-3 text-xs text-[var(--muted)]/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 opacity-50" />

                  <span className="truncate uppercase tracking-[0.08em]">
                    {item.label}
                  </span>
                </div>

                <span className="ml-3 shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
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
              className={`group flex min-h-14 items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] transition duration-200 ${
                isActive
                  ? "border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] shadow-lg shadow-[color-mix(in_srgb,var(--primary)_5%,transparent)]"
                  : "border border-transparent text-[var(--muted)] hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition ${
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
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