type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
};

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">
      <p className="text-sm font-medium text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-4 text-sm text-slate-400">
        {description}
      </p>
    </section>
  );
}