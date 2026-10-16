import Link from "next/link";
import { Sparkles, ArrowRight, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { signUp } from "./actions";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090a0f] px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-[#21252d] bg-[#121417] p-8 shadow-2xl">
        {/* Header Branding */}
        <div className="mb-8 text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#181b20] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            CareerMatch AI
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#8e95a2]">
            Start analysing your resume and finding better job matches.
          </p>
        </div>

        {/* Signup Form */}
        <form action={signUp} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
            >
              Full name
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                <User className="h-4 w-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
            >
              Email address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
            >
              Password
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10"
          >
            Create account
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="mt-6 pt-6 border-t border-[#21252d] text-center text-xs text-[#8e95a2]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#99f6e4] hover:underline"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#8e95a2] transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}