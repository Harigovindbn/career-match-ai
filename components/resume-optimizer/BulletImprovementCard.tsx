import type { BulletAnalysis } from "@/lib/resume-optimizer/bullet-analyser";

type BulletImprovementCardProps = {
  bullets: BulletAnalysis[];
};

function getStrengthStyles(
  strength: BulletAnalysis["strength"],
) {
  if (strength === "strong") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      score: "text-emerald-600",
    };
  }

  if (strength === "moderate") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      score: "text-amber-600",
    };
  }

  return {
    badge: "border-red-200 bg-red-50 text-red-700",
    score: "text-red-600",
  };
}

export default function BulletImprovementCard({
  bullets,
}: BulletImprovementCardProps) {
  if (bullets.length === 0) {
    return (
      <section className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="text-xl font-semibold text-slate-900">
          Bullet Improvements
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          No weak resume bullet points were detected.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Bullet Improvements
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Improve these resume bullet points to make your experience and
          projects stronger.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {bullets.map((bullet, index) => {
          const styles = getStrengthStyles(
            bullet.strength,
          );

          return (
            <article
              key={`${bullet.original}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badge}`}
                >
                  {bullet.strength}
                </span>

                <span
                  className={`text-sm font-bold ${styles.score}`}
                >
                  {bullet.score}/100
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Original
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {bullet.original}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  Suggested Improvement
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
                  {bullet.improved}
                </p>
              </div>

              {bullet.issues.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Why improve it?
                  </p>

                  <ul className="mt-3 space-y-2">
                    {bullet.issues.map(
                      (issue, issueIndex) => (
                        <li
                          key={`${issue}-${issueIndex}`}
                          className="flex gap-2 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />

                          <span>{issue}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}