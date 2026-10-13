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
      <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
              Positive results
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Resume strengths
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {analysis.strengths.length > 0 ? (
            analysis.strengths.map((strength, index) => (
              <div
                key={`${strength}-${index}`}
                className="flex gap-3 rounded-2xl border border-emerald-200 bg-white/80 p-4"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-700">
                  {strength}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
              <p className="text-sm leading-6 text-slate-600">
                Complete more ATS checks to display resume strengths.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-amber-200 bg-amber-50/50 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              Improvement plan
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-950">
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
                  className="flex gap-3 rounded-2xl border border-amber-200 bg-white/80 p-4"
                >
                  <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <p className="text-sm leading-6 text-slate-700">
                    {recommendation}
                  </p>
                </div>
              ),
            )
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-4">
              <p className="text-sm leading-6 text-slate-600">
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