import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "User";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            CareerMatch<span className="text-blue-500">AI</span>
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
            >
              Log out
            </button>
          </form>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-500">
            Career Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Welcome, {fullName}
          </h1>

          <p className="mt-3 text-slate-400">
            You are signed in as <strong>{user.email}</strong>.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:border-blue-500">
              <h2 className="text-lg font-semibold">Complete Profile</h2>
              <p className="mt-2 text-sm text-slate-400">
                Add your skills, education, projects and experience.
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:border-blue-500">
              <h2 className="text-lg font-semibold">Analyze Resume</h2>
              <p className="mt-2 text-sm text-slate-400">
                Upload your resume and receive AI-powered ATS feedback.
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:border-blue-500">
              <h2 className="text-lg font-semibold">Find Job Matches</h2>
              <p className="mt-2 text-sm text-slate-400">
                Discover jobs that match your profile and skills.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}