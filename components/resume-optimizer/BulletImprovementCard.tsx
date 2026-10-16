import type { BulletAnalysis } from "@/lib/resume-optimizer/bullet-analyser";

type BulletImprovementCardProps = {
  bullets: BulletAnalysis[];
};

function getStrengthStyles(
  strength: BulletAnalysis["strength"],
) {
  if (strength === "strong") {
    return {
      badge: "border-[#99f6e4]/30 bg-[#99f6e4]/10 text-[#99f6e4]",
      score: "text-[#99f6e4]",
    };
  }

  if (strength === "moderate") {
    return {
      badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      score: "text-amber-400",
    };
  }

  return {
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    score: "text-rose-400",
  };
}

export default function BulletImprovementCard({
  bullets,
}: BulletImprovementCardProps) {
  if (bullets.length === 0) {
    return (
      <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Bullet Improvements
        </h2>

        <p className="mt-3 text-xs leading-6 text-[#8e95a2]">
          No weak resume bullet points were detected.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Bullet Improvements
        </h2>

        <p className="mt-2 text-xs leading-6 text-[#8e95a2]">
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
              className="rounded-2xl border border-[#21252d] bg-[#181b20] p-5 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles.badge}`}
                >
                  {bullet.strength}
                </span>

                <span
                  className={`text-sm font-bold ${styles.score}`}
                >
                  {bullet.score}/100
                </span>
              </div>

              {/* Original Bullet */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8e95a2]">
                  Original
                </p>

                <p className="mt-2 text-xs leading-6 text-white/80">
                  {bullet.original}
                </p>
              </div>

              {/* Suggested Improvement */}
              <div className="rounded-2xl border border-[#99f6e4]/30 bg-[#99f6e4]/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#99f6e4]">
                  Suggested Improvement
                </p>

                <p className="mt-2 text-xs font-medium leading-6 text-white">
                  {bullet.improved}
                </p>
              </div>

              {/* Why Improve It? */}
              {bullet.issues.length > 0 ? (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8e95a2]">
                    Why improve it?
                  </p>

                  <ul className="mt-3 space-y-2">
                    {bullet.issues.map(
                      (issue, issueIndex) => (
                        <li
                          key={`${issue}-${issueIndex}`}
                          className="flex gap-2 text-xs leading-6 text-[#8e95a2]"
                        >
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#99f6e4]" />

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