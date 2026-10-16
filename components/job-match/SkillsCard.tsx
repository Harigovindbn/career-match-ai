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
    match: "bg-[#99f6e4]/10 text-[#99f6e4] border-[#99f6e4]/30",
    missing: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    extra: "bg-[#181b20] text-[#8e95a2] border-[#21252d]",
  };

  return (
    <span
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${styles[variant]}`}
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
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl space-y-8 sm:p-8">
      {/* Matching Skills */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#99f6e4]">
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
            <p className="text-xs text-[#8e95a2]">
              No matching skills detected.
            </p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-rose-400">
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
            <p className="text-xs text-[#8e95a2]">
              No missing skills detected.
            </p>
          )}
        </div>
      </div>

      {/* Additional Skills */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8e95a2]">
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
            <p className="text-xs text-[#8e95a2]">
              No additional skills found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}