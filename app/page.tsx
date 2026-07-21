import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            AI-Powered Career Assistant
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
            Match your resume with the right job
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Analyse job descriptions, identify missing skills, improve your
            resume, and understand how well your experience matches each role.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
              Analyse My Resume
            </button>

            <button className="rounded-lg border border-slate-600 px-6 py-3 font-semibold hover:bg-slate-900">
              Learn More
            </button>
          </div>

          <div className="mt-16 grid gap-5 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="font-semibold">Match Score</h2>
              <p className="mt-2 text-sm text-slate-400">
                Calculate how closely your resume matches a job description.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="font-semibold">Skill Analysis</h2>
              <p className="mt-2 text-sm text-slate-400">
                Find matching skills and important missing keywords.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="font-semibold">AI Suggestions</h2>
              <p className="mt-2 text-sm text-slate-400">
                Receive practical suggestions to improve your resume.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}