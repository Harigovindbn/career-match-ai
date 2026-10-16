import type { MatchLevel } from "@/lib/job-match/types";

type MatchScoreCardProps = {
  score: number;
  matchLevel: MatchLevel;
  summary: string;
};

function getScoreMessage(score: number): string {
  if (score >= 80) {
    return "Strong match";
  }

  if (score >= 65) {
    return "Good potential";
  }

  if (score >= 45) {
    return "Needs improvement";
  }

  return "Low compatibility";
}

function getScoreStyles(score: number): {
  badge: string;
  progress: string;
} {
  if (score >= 80) {
    return {
      badge: "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
      progress: "bg-[#99f6e4]",
    };
  }

  if (score >= 65) {
    return {
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      progress: "bg-emerald-400",
    };
  }

  if (score >= 45) {
    return {
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      progress: "bg-amber-400",
    };
  }

  return {
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    progress: "bg-rose-400",
  };
}

export default function MatchScoreCard({
  score,
  matchLevel,
  summary,
}: MatchScoreCardProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const styles = getScoreStyles(safeScore);

  return (
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8e95a2]">
            Overall match score
          </p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight text-white">
              {safeScore}%
            </span>

            <span className="pb-1 text-sm font-medium text-[#99f6e4]">
              {getScoreMessage(safeScore)}
            </span>
          </div>
        </div>

        <span
          className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}
        >
          {matchLevel}
        </span>
      </div>

      <div className="mt-6">
        <div className="h-2.5 overflow-hidden rounded-full bg-[#181b20] border border-[#21252d]">
          <div
            className={`h-full rounded-full transition-all duration-500 shadow-sm ${styles.progress}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#8e95a2]">
        {summary}
      </p>
    </section>
  );
}