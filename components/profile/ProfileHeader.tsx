import { Sparkles, UserRound } from "lucide-react";

export default function ProfileHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-dark p-8 text-white">
      {/* Background Decorations */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 left-1/2 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="h-6 w-6" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Career Match AI
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            My Profile
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Keep your personal information and professional details updated.
            Completing your profile improves job recommendations and AI career
            insights.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-dark">
              <UserRound className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Professional Profile
              </p>

              <p className="mt-1 text-sm text-white/60">
                Build a stronger career presence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}