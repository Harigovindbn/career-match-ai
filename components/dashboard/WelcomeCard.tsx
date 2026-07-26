import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type WelcomeCardProps = {
  fullName: string;
  email: string;
};

export default function WelcomeCard({
  fullName,
  email,
}: WelcomeCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-dark p-7 text-white sm:p-8">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="h-5 w-5" />
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Career Match AI
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome, {fullName}
        </h2>

        <p className="mt-3 text-sm text-white/60">
          You are signed in as {email}.
        </p>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
          Complete your professional profile, upload your resume, and use
          AI-powered tools to improve your career opportunities.
        </p>

        <Link
          href="/profile"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-dark hover:bg-white/90"
        >
          Complete your profile
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}