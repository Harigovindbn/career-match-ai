import {
  AlertTriangle,
  CheckCircle2,
  CircleX,
} from "lucide-react";

import type {
  AtsCheck,
  AtsCheckStatus,
} from "@/lib/ats/types";

type AtsChecksListProps = {
  checks: AtsCheck[];
};

const statusContent: Record<
  AtsCheckStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    containerClasses: string;
    iconClasses: string;
    badgeClasses: string;
  }
> = {
  passed: {
    label: "Passed",
    icon: CheckCircle2,
    containerClasses:
      "border-emerald-200 bg-emerald-50/50",
    iconClasses: "text-emerald-600",
    badgeClasses:
      "border-emerald-200 bg-emerald-100 text-emerald-700",
  },

  warning: {
    label: "Warning",
    icon: AlertTriangle,
    containerClasses: "border-amber-200 bg-amber-50/50",
    iconClasses: "text-amber-600",
    badgeClasses:
      "border-amber-200 bg-amber-100 text-amber-700",
  },

  failed: {
    label: "Failed",
    icon: CircleX,
    containerClasses: "border-red-200 bg-red-50/50",
    iconClasses: "text-red-600",
    badgeClasses:
      "border-red-200 bg-red-100 text-red-700",
  },
};

export default function AtsChecksList({
  checks,
}: AtsChecksListProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Detailed evaluation
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          ATS resume checks
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review every check to understand what is helping or reducing
          your score.
        </p>
      </div>

      <div className="mt-7 space-y-4">
        {checks.map((check) => {
          const status = statusContent[check.status];
          const Icon = status.icon;

          return (
            <article
              key={check.id}
              className={`rounded-3xl border p-5 ${status.containerClasses}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon
                      className={`h-5 w-5 ${status.iconClasses}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">
                      {check.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {check.description}
                    </p>

                    {check.recommendation ? (
                      <div className="mt-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                          Recommendation
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {check.recommendation}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${status.badgeClasses}`}
                  >
                    {status.label}
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {check.score}/{check.maximumScore}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}