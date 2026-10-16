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
    containerClasses: "border-[#99f6e4]/20 bg-[#99f6e4]/5",
    iconClasses: "text-[#99f6e4]",
    badgeClasses:
      "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
  },

  warning: {
    label: "Warning",
    icon: AlertTriangle,
    containerClasses: "border-amber-500/20 bg-amber-500/5",
    iconClasses: "text-amber-400",
    badgeClasses:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },

  failed: {
    label: "Failed",
    icon: CircleX,
    containerClasses: "border-rose-500/20 bg-rose-500/5",
    iconClasses: "text-rose-400",
    badgeClasses:
      "border-rose-500/30 bg-rose-500/10 text-rose-400",
  },
};

export default function AtsChecksList({
  checks,
}: AtsChecksListProps) {
  return (
    <section className="rounded-[2rem] border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
          Detailed evaluation
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          ATS resume checks
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#8e95a2]">
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
              className={`rounded-3xl border p-5 transition ${status.containerClasses}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#21252d] bg-[#181b20] shadow-sm">
                    <Icon
                      className={`h-5 w-5 ${status.iconClasses}`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {check.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#8e95a2]">
                      {check.description}
                    </p>

                    {check.recommendation ? (
                      <div className="mt-3 rounded-2xl border border-[#21252d] bg-[#181b20] px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8e95a2]">
                          Recommendation
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white/90">
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

                  <span className="text-sm font-semibold text-white">
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