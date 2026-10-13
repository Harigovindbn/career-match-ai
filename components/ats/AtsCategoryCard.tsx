import {
  BarChart3,
  BriefcaseBusiness,
  Contact,
  FileCheck2,
  LayoutList,
  Medal,
  ScanText,
} from "lucide-react";

import type {
  AtsCategory,
  AtsCategoryScore,
} from "@/lib/ats/types";

type AtsCategoryCardProps = {
  categoryScore: AtsCategoryScore;
};

const categoryIcons = {
  contact: Contact,
  sections: LayoutList,
  skills: FileCheck2,
  experience: BriefcaseBusiness,
  achievements: Medal,
  readability: ScanText,
  formatting: BarChart3,
} satisfies Record<AtsCategory, typeof Contact>;

function getProgressClasses(percentage: number): string {
  if (percentage >= 80) {
    return "bg-emerald-500";
  }

  if (percentage >= 60) {
    return "bg-blue-500";
  }

  if (percentage >= 40) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}

export default function AtsCategoryCard({
  categoryScore,
}: AtsCategoryCardProps) {
  const Icon = categoryIcons[categoryScore.category];

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xl font-semibold text-slate-950">
          {categoryScore.percentage}%
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-950">
        {categoryScore.label}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {categoryScore.score} of {categoryScore.maximumScore} points
      </p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getProgressClasses(
            categoryScore.percentage,
          )}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, categoryScore.percentage),
            )}%`,
          }}
        />
      </div>
    </article>
  );
}