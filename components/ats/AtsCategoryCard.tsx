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
    return "bg-[#99f6e4]";
  }

  if (percentage >= 60) {
    return "bg-emerald-400";
  }

  if (percentage >= 40) {
    return "bg-amber-400";
  }

  return "bg-rose-400";
}

export default function AtsCategoryCard({
  categoryScore,
}: AtsCategoryCardProps) {
  const Icon = categoryIcons[categoryScore.category];

  return (
    <article className="rounded-3xl border border-[#21252d] bg-[#121417] p-5 text-white shadow-2xl transition hover:border-[#99f6e4]/40 hover:bg-[#181b20]">
      <div className="flex items-start justify-between gap-4">
        {/* Mint Highlighted Icon Container */}
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99f6e4]/10 text-[#99f6e4] border border-[#99f6e4]/20">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xl font-semibold text-white">
          {categoryScore.percentage}%
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-white">
        {categoryScore.label}
      </h3>

      <p className="mt-1 text-xs text-[#8e95a2]">
        {categoryScore.score} of {categoryScore.maximumScore} points
      </p>

      {/* Progress Bar Track */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#181b20] border border-[#21252d]">
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