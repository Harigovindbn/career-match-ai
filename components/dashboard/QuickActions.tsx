import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  FileText,
  UserRound,
} from "lucide-react";

const actions = [
  {
    title: "Complete Profile",
    description: "Update your personal and professional information.",
    href: "/profile",
    icon: UserRound,
    available: true,
  },
  {
    title: "Upload Resume",
    description: "Upload your resume for AI-powered ATS analysis.",
    href: "/resume",
    icon: FileText,
    available: false,
  },
  {
    title: "Find Job Matches",
    description: "Discover opportunities that fit your professional skills.",
    href: "/jobs",
    icon: BriefcaseBusiness,
    available: false,
  },
  {
    title: "AI Career Assistant",
    description: "Get personalized career guidance and interview support.",
    href: "/assistant",
    icon: Bot,
    available: false,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-white/10 bg-card-dark p-6 text-white sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          Shortcuts
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          Quick actions
        </h3>

        <p className="mt-2 text-sm text-white/65">
          Access the most important Career Match AI tools.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          if (!action.available) {
            return (
              <div
                key={action.title}
                className="relative cursor-not-allowed rounded-2xl border border-white/10 bg-white/10 p-4 opacity-70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    Soon
                  </span>
                </div>

                <p className="mt-4 font-semibold text-white">
                  {action.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/65">
                  {action.description}
                </p>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-white/10 bg-white/10 p-4 hover:bg-white/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-dark">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-white/55 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>

              <p className="mt-4 font-semibold text-white">
                {action.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/65">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}