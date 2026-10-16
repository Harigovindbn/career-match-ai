"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, LayoutDashboard, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#21252d] bg-[#090a0f] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#99f6e4] text-[#042f2e]">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>
            CareerMatch<span className="text-[#99f6e4]">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[#8e95a2] transition hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4 text-[#99f6e4]" />
            Dashboard
          </Link>
          <Link
            href="/ats-score"
            className="text-[#8e95a2] transition hover:text-white"
          >
            Resume Analyzer
          </Link>
          <Link
            href="/job-match"
            className="text-[#8e95a2] transition hover:text-white"
          >
            Job Matcher
          </Link>
        </div>

        {/* Desktop CTA & 3-Dot Options Dropdown */}
        <div className="relative flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden rounded-xl bg-[#99f6e4] px-4 py-2 text-xs font-semibold text-[#042f2e] transition hover:bg-[#5eead4] sm:inline-block"
          >
            Sign In
          </Link>

          {/* 3-Dot Action Button */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#21252d] bg-[#121417] text-[#8e95a2] transition hover:border-[#99f6e4]/40 hover:text-white"
              aria-label="Options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* 3-Dot Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#21252d] bg-[#121417] p-2 shadow-2xl z-50">
                {/* Mobile-only page links */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs text-[#8e95a2] transition hover:bg-[#181b20] hover:text-white md:hidden"
                >
                  Dashboard
                </Link>
                <Link
                  href="/ats-score"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs text-[#8e95a2] transition hover:bg-[#181b20] hover:text-white md:hidden"
                >
                  Resume Analyzer
                </Link>
                <Link
                  href="/job-match"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs text-[#8e95a2] transition hover:bg-[#181b20] hover:text-white md:hidden"
                >
                  Job Matcher
                </Link>

                <div className="my-1 border-t border-[#21252d] md:hidden" />

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs text-[#8e95a2] transition hover:bg-[#181b20] hover:text-white"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/resume-optimizer"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs text-[#8e95a2] transition hover:bg-[#181b20] hover:text-white"
                >
                  AI Career Assistant
                </Link>
                <div className="my-1 border-t border-[#21252d]" />
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-xs font-medium text-[#99f6e4] transition hover:bg-[#181b20]"
                >
                  Sign In / Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}