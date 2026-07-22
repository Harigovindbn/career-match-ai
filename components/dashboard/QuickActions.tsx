import Link from "next/link";

type QuickAction = {
  title: string;
  description: string;
  href: string;
  status?: "available" | "coming-soon";
};

const actions: QuickAction[] = [
  {
    title: "Complete Profile",
    description: "Update your personal and professional information.",
    href: "/profile",
    status: "available",
  },
  {
    title: "Upload Resume",
    description: "Upload your resume for AI-powered ATS analysis.",
    href: "/resume",
    status: "coming-soon",
  },
  {
    title: "Find Job Matches",
    description: "Discover job opportunities that fit your skills.",
    href: "/jobs",
    status: "coming-soon",
  },
  {
    title: "AI Career Assistant",
    description: "Get personalized career guidance and interview help.",
    href: "/assistant",
    status: "coming-soon",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-blue-500">
          Shortcuts
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Access the most important CareerMatchAI tools.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const isAvailable = action.status === "available";

          if (isAvailable) {
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {action.description}
                    </p>
                  </div>

                  <span className="text-blue-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={action.title}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5 opacity-70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {action.description}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400">
                  Soon
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}