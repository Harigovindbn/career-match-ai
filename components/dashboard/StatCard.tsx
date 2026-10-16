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
    <article className="group rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white transition duration-300 hover:-translate-y-1 hover:border-[#99f6e4]/40 hover:bg-[#181b20] hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#99f6e4]/20 bg-[#99f6e4]/10 text-[#99f6e4]">
          <Icon className="h-6 w-6" />
        </div>

        <span className="rounded-full border border-[#21252d] bg-[#181b20] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
          Status
        </span>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-4 text-xs leading-relaxed text-[#8e95a2]">
        {description}
      </p>
    </article>
  );
}