import {
  CheckCircle2,
  Lightbulb,
  ListChecks,
  Sparkles,
} from "lucide-react";

import type { AtsAnalysis } from "@/lib/ats/types";

type AtsRecommendationsProps = {
  analysis: AtsAnalysis;
};

export default function AtsRecommendations({
  analysis,
}: AtsRecommendationsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Strengths Section */}
      <section className="rounded-[2rem] border border-[#99f6e4]/20 bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99f6e4] text-[#042f2e]">
            <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#99f6e4]">
              Positive results
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Resume strengths
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {analysis.strengths.length > 0 ? (
            analysis.strengths.map((strength, index) => (
              <div
                key={`${strength}-${index}`}
                className="flex gap-3 rounded-2xl border border-[#21252d] bg-[#181b20] p-4"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#99f6e4]" />

                <p className="text-sm leading-6 text-[#8e95a2]">
                  {strength}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-4">
              <p className="text-sm leading-6 text-[#8e95a2]">
                Complete more ATS checks to display resume strengths.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="rounded-[2rem] border border-amber-500/20 bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-400">
              Improvement plan
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Recommendations
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {analysis.recommendations.length > 0 ? (
            analysis.recommendations.map(
              (recommendation, index) => (
                <div
                  key={`${recommendation}-${index}`}
                  className="flex gap-3 rounded-2xl border border-[#21252d] bg-[#181b20] p-4"
                >
                  <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                  <p className="text-sm leading-6 text-[#8e95a2]">
                    {recommendation}
                  </p>
                </div>
              ),
            )
          ) : (
            <div className="rounded-2xl border border-[#21252d] bg-[#181b20] p-4">
              <p className="text-sm leading-6 text-[#8e95a2]">
                Your resume passed all major checks. Review it once more
                before submitting.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}