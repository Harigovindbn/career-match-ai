import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export const authInputClass =
  "w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]";

export const authButtonClass =
  "w-full flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/15 cursor-pointer disabled:opacity-50";

export function AuthNotice({ error, success }: { error: string | null; success: string | null }) {
  if (error) {
    return (
      <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
        {error}
      </div>
    );
  }
  if (success) {
    return (
      <div role="status" className="mb-5 rounded-xl border border-[#99f6e4]/30 bg-[#99f6e4]/10 p-3 text-xs text-[#99f6e4]">
        {success}
      </div>
    );
  }
  return null;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0f] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#21252d] bg-[#121417] p-8 shadow-2xl">
        <div className="mb-8 space-y-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            CareerMatch AI
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-[#8e95a2]">{subtitle}</p>
        </div>

        {children}

        <div className="mt-6 border-t border-[#21252d] pt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#8e95a2] transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
