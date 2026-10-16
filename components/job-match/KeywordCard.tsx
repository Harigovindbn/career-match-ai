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
    "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]";

  const missingStyle =
    "border-rose-500/30 bg-rose-500/10 text-rose-400";

  const importanceStyle = {
    high: "ring-2 ring-amber-400/40",
    medium: "",
    low: "opacity-70",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        found ? foundStyle : missingStyle
      } ${importanceStyle[importance]}`}
    >
      <span>{found ? "✓" : "×"}</span>
      <span>{keyword}</span>

      {importance === "high" ? (
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
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
    <section className="space-y-7 rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Keyword Analysis
            </h2>

            <p className="mt-1 text-xs text-[#8e95a2]">
              Keywords detected from the job description.
            </p>
          </div>

          <span className="text-2xl font-bold text-[#99f6e4]">
            {safeCoverage}%
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#181b20] border border-[#21252d]">
          <div
            className="h-full rounded-full bg-[#99f6e4] transition-all duration-500 shadow-sm shadow-[#99f6e4]/20"
            style={{ width: `${safeCoverage}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#99f6e4]">
          Matching keywords ({matchingKeywords.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {matchingKeywords.length > 0 ? (
            matchingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#99f6e4]/30 bg-[#99f6e4]/10 px-3 py-1 text-xs font-medium text-[#99f6e4]"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#8e95a2]">
              No matching keywords detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-rose-400">
          Missing keywords ({missingKeywords.length})
        </h3>

        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#8e95a2]">
              No missing keywords detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8e95a2]">
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
            <p className="text-xs text-[#8e95a2]">
              No keyword details available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}