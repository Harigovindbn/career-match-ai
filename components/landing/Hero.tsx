export default function Hero() {
  return (
    <section className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI-Powered Career Assistant
        </p>

        <h1 className="mt-4 text-5xl font-bold leading-tight sm:text-7xl">
          Match your resume with the right job
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Analyse job descriptions, identify missing skills, improve your
          resume, and understand how well your experience matches each role.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-lg bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-500">
            Analyse My Resume
          </button>

          <button className="rounded-lg border border-slate-600 px-8 py-4 font-semibold transition hover:bg-slate-900">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}