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
    <section className="rounded-3xl bg-brand p-7 text-white sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/65">
            Profile Completion
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {percentage}%
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white/75">
          <CircleCheckBig className="h-4 w-4" />
          {status}
        </div>
      </div>

      <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/15">
        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-6 text-sm leading-6 text-white/70">
        Add more professional details to improve your job recommendations.
      </p>

      <Link
        href="/profile"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-white/75"
      >
        Update profile
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}