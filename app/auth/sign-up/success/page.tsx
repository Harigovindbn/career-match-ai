import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MailCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Check your email" };

export default async function SignUpSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0f] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#21252d] bg-[#121417] p-8 text-center shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          CareerMatch AI
        </Link>

        <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#99f6e4]/10 text-[#99f6e4]">
          <MailCheck className="h-7 w-7" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">Check your email</h1>

        <p className="mt-3 text-sm leading-6 text-[#8e95a2]">
          We sent a confirmation link to{" "}
          {email ? <span className="font-semibold text-white">{email}</span> : "your inbox"}.
          Click the link to activate your account, then sign in.
        </p>

        <p className="mt-3 text-xs text-[#8e95a2]">
          Didn&apos;t get it? Check your spam folder, or try signing up again in a few minutes.
        </p>

        <Link
          href="/auth/login"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4]"
        >
          Go to sign in
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
