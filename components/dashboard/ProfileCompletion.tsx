import Link from "next/link";
import { ArrowRight, CircleCheckBig } from "lucide-react";

type ProfileCompletionProps = {
  percentage: number;
};

export default function ProfileCompletion({
  percentage,
}: ProfileCompletionProps) {
  const status =
    percentage === 100 ? "Completed" : "In progress";

  return (
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-7 text-white shadow-2xl sm:p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8e95a2]">
              Profile Completion
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-white">
              {percentage}%
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-3 py-2 text-xs font-semibold text-[#99f6e4]">
            <CircleCheckBig className="h-4 w-4" />
            {status}
          </div>
        </div>

        <div className="mt-8 h-2.5 overflow-hidden rounded-full border border-[#21252d] bg-[#181b20]">
          <div
            className="h-full rounded-full bg-[#99f6e4] transition-all duration-500 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-[#8e95a2]">
          Add more professional details to improve your job recommendations.
        </p>
      </div>

      <Link
        href="/profile"
        className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#99f6e4] hover:text-[#5eead4] transition"
      >
        Update profile
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}