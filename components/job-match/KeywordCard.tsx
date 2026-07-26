import type { KeywordMatch } from "@/lib/job-match/types";

type KeywordCardProps = {
  keywordCoverage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  keywordDetails: KeywordMatch[];
};

function KeywordBadge({
  keyword,
  found,
  importance,
}: KeywordMatch) {
  const foundStyle =
    "border-emerald-200 bg-emerald-50 text-emerald-700";

  const missingStyle =
    "border-red-200 bg-red-50 text-red-700";

  const importanceStyle = {
    high: "ring-2 ring-amber-200",
    medium: "",
    low: "opacity-80",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
        found ? foundStyle : missingStyle
      } ${importanceStyle[importance]}`}
    >
      <span>{found ? "✓" : "×"}</span>
      <span>{keyword}</span>

      {importance === "high" ? (
        <span className="text-xs font-semibold uppercase">
          High
        </span>
      ) : null}
    </span>
  );
}

export default function KeywordCard({
  keywordCoverage,
  matchingKeywords,
  missingKeywords,
  keywordDetails,
}: KeywordCardProps) {
  const safeCoverage = Math.max(
    0,
    Math.min(100, Math.round(keywordCoverage)),
  );

  return (
    <section className="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Keyword Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keywords detected from the job description.
            </p>
          </div>

          <span className="text-2xl font-bold text-slate-900">
            {safeCoverage}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${safeCoverage}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Matching keywords ({matchingKeywords.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {matchingKeywords.length > 0 ? (
            matchingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No matching keywords detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Missing keywords ({missingKeywords.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No missing keywords detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Detailed keyword results
        </h3>

        <div className="flex flex-wrap gap-2">
          {keywordDetails.length > 0 ? (
            keywordDetails.map((detail) => (
              <KeywordBadge
                key={detail.keyword}
                keyword={detail.keyword}
                found={detail.found}
                importance={detail.importance}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No keyword details available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}