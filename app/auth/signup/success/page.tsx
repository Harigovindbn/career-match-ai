import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-white">
          Check your email
        </h1>

        <p className="mt-3 text-slate-400">
          Your account was created successfully. Open the confirmation email
          from Supabase and verify your email address.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}