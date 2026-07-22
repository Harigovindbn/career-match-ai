type WelcomeCardProps = {
  fullName: string;
  email: string;
};

export default function WelcomeCard({
  fullName,
  email,
}: WelcomeCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm font-medium uppercase tracking-wider text-blue-500">
        Career Dashboard
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Welcome, {fullName}
      </h1>

      <p className="mt-3 text-sm text-slate-400 sm:text-base">
        You are signed in as{" "}
        <span className="font-medium text-slate-200">{email}</span>.
      </p>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
        Complete your profile, upload your resume, and use AI-powered tools to
        improve your career opportunities.
      </p>
    </section>
  );
}