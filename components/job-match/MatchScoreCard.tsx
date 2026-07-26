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
      badge: "bg-emerald-100 text-emerald-700",
      progress: "bg-emerald-500",
    };
  }

  if (score >= 65) {
    return {
      badge: "bg-blue-100 text-blue-700",
      progress: "bg-blue-500",
    };
  }

  if (score >= 45) {
    return {
      badge: "bg-amber-100 text-amber-700",
      progress: "bg-amber-500",
    };
  }

  return {
    badge: "bg-red-100 text-red-700",
    progress: "bg-red-500",
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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Overall match score
          </p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight text-slate-900">
              {safeScore}%
            </span>

            <span className="pb-1 text-sm font-medium text-slate-500">
              {getScoreMessage(safeScore)}
            </span>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${styles.badge}`}
        >
          {matchLevel}
        </span>
      </div>

      <div className="mt-6">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.progress}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        {summary}
      </p>
    </section>
  );
}