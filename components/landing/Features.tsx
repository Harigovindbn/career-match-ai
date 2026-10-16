import { Sparkles } from "lucide-react";

const features = [
  {
    title: "Resume Match Score",
    description:
      "Compare your resume with a job description and receive a clear compatibility score.",
  },
  {
    title: "Missing Skills",
    description:
      "Identify important technical skills, keywords, and qualifications missing from your resume.",
  },
  {
    title: "AI Suggestions",
    description:
      "Get practical recommendations to improve your resume for a specific job role.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-t border-[#21252d] bg-[#090a0f] px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#121417] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]">
            <Sparkles className="h-3.5 w-3.5" />
            Core Features
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl text-white">
            Understand your job readiness
          </h2>

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#8e95a2]">
            CareerMatch AI helps you understand how well your resume fits a
            role before you apply.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-3xl border border-[#21252d] bg-[#121417] p-8 transition hover:border-[#99f6e4]/40 hover:bg-[#181b20]"
            >
              {/* Mint Badge Indicator */}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#99f6e4] text-[#042f2e] font-bold shadow-sm">
                0{index + 1}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white group-hover:text-[#99f6e4] transition">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#8e95a2]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}