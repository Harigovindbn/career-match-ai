import { Clock3 } from "lucide-react";

type Activity = {
  title: string;
  description: string;
  time: string;
};

type RecentActivityProps = {
  activities: Activity[];
};

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-card-dark p-6 text-white sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Activity
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          Recent activity
        </h3>

        <p className="mt-2 text-sm text-white/65">
          Review your latest actions and career progress.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {activities.map((activity) => (
          <div
            key={`${activity.title}-${activity.time}`}
            className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <p className="font-semibold text-white">
                  {activity.title}
                </p>

                <span className="text-xs font-medium text-white/55">
                  {activity.time}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-white/65">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}