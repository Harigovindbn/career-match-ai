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
      className="border-t border-slate-800 bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Core Features
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            Understand your job readiness
          </h2>

          <p className="mt-5 text-slate-400">
            CareerMatch AI helps you understand how well your resume fits a
            role before you apply.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 font-bold">
                {index + 1}
              </div>

              <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>

              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}