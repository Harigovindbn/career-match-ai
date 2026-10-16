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
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white shadow-2xl sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
          Activity
        </p>

        <h3 className="mt-2 text-xl font-bold tracking-tight text-white">
          Recent activity
        </h3>

        <p className="mt-2 text-xs text-[#8e95a2]">
          Review your latest actions and career progress.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {activities.map((activity) => (
          <div
            key={`${activity.title}-${activity.time}`}
            className="flex gap-4 rounded-2xl border border-[#21252d] bg-[#181b20] p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <p className="text-sm font-bold text-white">
                  {activity.title}
                </p>

                <span className="text-[11px] font-medium text-[#8e95a2]">
                  {activity.time}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[#8e95a2]">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}