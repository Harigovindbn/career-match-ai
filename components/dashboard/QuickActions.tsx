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
  },
  {
    title: "Upload Resume",
    description: "Upload your resume for AI-powered ATS analysis.",
    href: "/ats-score",
    icon: FileText,
  },
  {
    title: "Find Job Matches",
    description: "Discover opportunities that fit your professional skills.",
    href: "/job-match",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI Career Assistant",
    description: "Get personalized career guidance and interview support.",
    href: "/resume-optimizer",
    icon: Bot,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-[#21252d] bg-[#121417] p-6 text-white sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#99f6e4]">
          Shortcuts
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
          Quick actions
        </h3>

        <p className="mt-2 text-sm text-[#8e95a2]">
          Access the most important Career Match AI tools.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-[#21252d] bg-[#181b20] p-4 transition hover:border-[#99f6e4]/40 hover:bg-[#21252d]"
            >
              <div className="flex items-start justify-between gap-3">
                {/* High contrast mint pill for clear icon visibility */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#99f6e4] text-[#042f2e] shadow-sm">
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>

                <ArrowUpRight className="h-5 w-5 text-[#8e95a2] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#99f6e4]" />
              </div>

              <p className="mt-4 font-semibold text-white group-hover:text-[#99f6e4] transition">
                {action.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#8e95a2]">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}