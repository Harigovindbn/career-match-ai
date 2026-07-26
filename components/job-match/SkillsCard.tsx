type SkillsCardProps = {
  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
};

function SkillBadge({
  label,
  variant,
}: {
  label: string;
  variant: "match" | "missing" | "extra";
}) {
  const styles = {
    match: "bg-emerald-100 text-emerald-700 border-emerald-200",
    missing: "bg-red-100 text-red-700 border-red-200",
    extra: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export default function SkillsCard({
  matchingSkills,
  missingSkills,
  additionalSkills,
}: SkillsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          ✅ Matching Skills ({matchingSkills.length})
        </h2>

        <div className="flex flex-wrap gap-2">
          {matchingSkills.length ? (
            matchingSkills.map((skill) => (
              <SkillBadge
                key={skill}
                label={skill}
                variant="match"
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No matching skills detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          ❌ Missing Skills ({missingSkills.length})
        </h2>

        <div className="flex flex-wrap gap-2">
          {missingSkills.length ? (
            missingSkills.map((skill) => (
              <SkillBadge
                key={skill}
                label={skill}
                variant="missing"
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No missing skills detected.
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          ⭐ Additional Skills ({additionalSkills.length})
        </h2>

        <div className="flex flex-wrap gap-2">
          {additionalSkills.length ? (
            additionalSkills.map((skill) => (
              <SkillBadge
                key={skill}
                label={skill}
                variant="extra"
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No additional skills found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}