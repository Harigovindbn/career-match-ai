import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-card-dark p-6 text-white transition duration-300 hover:-translate-y-1 hover:bg-card-dark-hover hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Icon className="h-6 w-6" />
        </div>

        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
          Status
        </span>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
        {title}
      </p>

      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-4 text-sm leading-6 text-white/65">
        {description}
      </p>
    </article>
  );
}