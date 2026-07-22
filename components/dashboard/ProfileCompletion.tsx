type ProfileCompletionProps = {
  percentage: number;
};

export default function ProfileCompletion({
  percentage,
}: ProfileCompletionProps) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Profile Completion
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {safePercentage}%
          </h2>
        </div>

        <div className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
          {safePercentage === 100 ? "Complete" : "In progress"}
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {safePercentage === 100
          ? "Your profile is complete and ready for job matching."
          : "Add more professional details to improve your job recommendations."}
      </p>
    </section>
  );
}