import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8e95a2] hover:text-[#99f6e4] transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#121417] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#99f6e4] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Account Overview
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-[#8e95a2]">
            Manage your personal details and account preferences
          </p>
        </div>
      </div>
    </div>
  );
}