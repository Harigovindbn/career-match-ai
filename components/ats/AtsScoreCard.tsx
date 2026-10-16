import {
  Award,
  CircleCheckBig,
  FileText,
  Gauge,
} from "lucide-react";

import type { AtsAnalysis } from "@/lib/ats/types";

type AtsScoreCardProps = {
  analysis: AtsAnalysis;
};

function getScoreMessage(score: number): string {
  if (score >= 85) {
    return "Excellent ATS compatibility";
  }

  if (score >= 70) {
    return "Good ATS compatibility";
  }

  if (score >= 50) {
    return "Resume needs improvement";
  }

  return "Low ATS compatibility";
}

function getScoreClasses(score: number): {
  ring: string;
  badge: string;
} {
  if (score >= 85) {
    return {
      ring: "text-[#99f6e4]",
      badge:
        "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
    };
  }

  if (score >= 70) {
    return {
      ring: "text-emerald-400",
      badge:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };
  }

  if (score >= 50) {
    return {
      ring: "text-amber-400",
      badge:
        "border-amber-500/30 bg-amber-500/10 text-amber-400",
    };
  }

  return {
    ring: "text-rose-400",
    badge:
      "border-rose-500/30 bg-rose-500/10 text-rose-400",
  };
}

export default function AtsScoreCard({
  analysis,
}: AtsScoreCardProps) {
  const scoreClasses = getScoreClasses(analysis.overallScore);

  const passedChecks = analysis.checks.filter(
    (check) => check.status === "passed",
  ).length;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#21252d] bg-[#121417] text-white shadow-2xl">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_1fr]">
        {/* Left Circular Score Box */}
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-[#21252d] bg-[#181b20] px-6 py-10 text-center text-white">
          <div
            className={`relative flex h-48 w-48 items-center justify-center rounded-full bg-[#090a0f] ${scoreClasses.ring}`}
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-[#21252d]"
              />

              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${analysis.overallScore * 2.64} 264`}
              />
            </svg>

            <div className="relative">
              <p className="text-5xl font-bold text-white">
                {analysis.overallScore}
              </p>

              <p className="mt-1 text-sm font-medium text-[#8e95a2]">
                out of 100
              </p>
            </div>
          </div>

          <div
            className={`mt-6 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${scoreClasses.badge}`}
          >
            {analysis.rating}
          </div>

          <p className="mt-4 text-sm font-medium text-white">
            {getScoreMessage(analysis.overallScore)}
          </p>
        </div>

        {/* Right Analysis Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e]">
              <Gauge className="h-5 w-5 stroke-[2.2]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
                ATS analysis result
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-white">
                Resume compatibility score
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#8e95a2]">
            {analysis.summary}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[#21252d] bg-[#181b20] p-5">
              <CircleCheckBig className="h-5 w-5 text-[#99f6e4]" />

              <p className="mt-4 text-2xl font-semibold text-white">
                {passedChecks}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8e95a2]">
                Checks passed
              </p>
            </div>

            <div className="rounded-3xl border border-[#21252d] bg-[#181b20] p-5">
              <FileText className="h-5 w-5 text-[#99f6e4]" />

              <p className="mt-4 text-2xl font-semibold text-white">
                {analysis.wordCount}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8e95a2]">
                Resume words
              </p>
            </div>

            <div className="rounded-3xl border border-[#21252d] bg-[#181b20] p-5">
              <Award className="h-5 w-5 text-[#99f6e4]" />

              <p className="mt-4 text-2xl font-semibold text-white">
                {analysis.detectedSkills.length}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#8e95a2]">
                Skills detected
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}