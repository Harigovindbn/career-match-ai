type ActivityItem = {
  title: string;
  description: string;
  time: string;
};

type RecentActivityProps = {
  activities?: ActivityItem[];
};

const defaultActivities: ActivityItem[] = [
  {
    title: "Profile updated",
    description: "Your professional profile information was updated.",
    time: "Recently",
  },
  {
    title: "Account created",
    description: "Your CareerMatchAI account is ready.",
    time: "Earlier",
  },
];

export default function RecentActivity({
  activities = defaultActivities,
}: RecentActivityProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-blue-500">
          Activity
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Recent Activity
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Review your latest actions and career progress.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={`${activity.title}-${index}`}
              className="flex gap-4 border-b border-slate-800 pb-5 last:border-b-0 last:pb-0"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h3 className="font-semibold text-white">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
            <p className="text-sm text-slate-400">
              No recent activity yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}