import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function WelcomeCard({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#21252d] bg-[#121417] p-8 text-white">
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#181b20] border border-[#21252d] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#99f6e4]">
          <Sparkles className="h-3.5 w-3.5" />
          Career Match AI
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome, <span className="text-[#99f6e4]">{fullName}</span>
          </h2>
          <p className="mt-1 text-sm text-[#8e95a2]">
            Signed in as <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        <p className="max-w-xl text-sm leading-relaxed text-[#8e95a2]">
          Complete your professional profile, upload your resume, and use AI-powered tools to improve your career opportunities.
        </p>

        <div className="pt-2">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-2.5 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4]"
          >
            Complete your profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}