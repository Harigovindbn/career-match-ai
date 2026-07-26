"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { logout } from "@/app/actions/auth";

type AppHeaderProps = {
  fullName: string;
  email: string;
};

function getInitials(fullName: string): string {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}

export default function AppHeader({
  fullName,
  email,
}: AppHeaderProps) {
  const initials = getInitials(fullName);

  const [isVisible, setIsVisible] = useState(true);

  const isVisibleRef = useRef(true);
  const previousScrollPosition = useRef(0);
  const accumulatedScroll = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    previousScrollPosition.current = window.scrollY;

    function showHeader(): void {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    }

    function hideHeader(): void {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    }

    function updateHeaderVisibility(): void {
      const currentScrollPosition = window.scrollY;

      const scrollDifference =
        currentScrollPosition -
        previousScrollPosition.current;

      /*
       * Always show the header near the top.
       */
      if (currentScrollPosition <= 120) {
        accumulatedScroll.current = 0;
        showHeader();
      } else if (scrollDifference !== 0) {
        const scrollingDown = scrollDifference > 0;
        const scrollingUp = scrollDifference < 0;

        const accumulatedDirection =
          accumulatedScroll.current > 0
            ? "down"
            : accumulatedScroll.current < 0
              ? "up"
              : "none";

        /*
         * Reset the distance when the scrolling
         * direction changes.
         */
        if (
          scrollingDown &&
          accumulatedDirection === "up"
        ) {
          accumulatedScroll.current = 0;
        }

        if (
          scrollingUp &&
          accumulatedDirection === "down"
        ) {
          accumulatedScroll.current = 0;
        }

        accumulatedScroll.current += scrollDifference;

        /*
         * Hide after scrolling down sufficiently.
         */
        if (
          isVisibleRef.current &&
          accumulatedScroll.current >= 220
        ) {
          hideHeader();
          accumulatedScroll.current = 0;
        }

        /*
         * Show after scrolling upward sufficiently.
         */
        if (
          !isVisibleRef.current &&
          accumulatedScroll.current <= -120
        ) {
          showHeader();
          accumulatedScroll.current = 0;
        }
      }

      previousScrollPosition.current =
        currentScrollPosition;

      ticking.current = false;
    }

    function handleScroll(): void {
      if (ticking.current) {
        return;
      }

      ticking.current = true;

      window.requestAnimationFrame(
        updateHeaderVisibility,
      );
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  return (
    <header
      className={`sticky top-5 z-40 overflow-hidden rounded-[2rem] border border-white/10 bg-brand-dark text-white transition-[transform,opacity,filter,box-shadow] duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100 blur-0 shadow-[0_20px_60px_rgba(2,12,27,0.24)]"
          : "pointer-events-none -translate-y-[calc(100%+2.5rem)] opacity-0 blur-[2px] shadow-none"
      }`}
    >
      <div className="flex min-h-28 items-center justify-between gap-5 px-6 sm:px-8 lg:px-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Welcome back
          </p>

          <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-white">
            {fullName}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/profile"
            className="hidden items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20 sm:flex"
          >
            <UserRound className="h-4 w-4" />
            View profile
          </Link>

          <div className="hidden max-w-48 text-right xl:block">
            <p className="truncate text-sm font-semibold text-white">
              {fullName}
            </p>

            <p className="mt-1 truncate text-xs text-white/60">
              {email}
            </p>
          </div>

          <Link
            href="/profile"
            aria-label="Open profile"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/15 text-sm font-bold text-white transition hover:bg-white/25"
          >
            {initials}
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/20 sm:px-5"
            >
              <LogOut className="h-4 w-4" />

              <span className="hidden sm:inline">
                Log out
              </span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}