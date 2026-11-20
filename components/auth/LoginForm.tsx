"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({
  initialError = null,
  initialMessage = null,
}: {
  initialError?: string | null;
  initialMessage?: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col justify-center items-center px-4 py-12 text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#21252d] bg-[#121417] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#99f6e4]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            CareerMatch AI
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-sm text-[#8e95a2]">
            Sign in to access your dashboard and AI career tools
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-8 shadow-2xl">
          {initialMessage && !errorMsg && (
            <div className="mb-4 rounded-xl border border-[#99f6e4]/30 bg-[#99f6e4]/10 p-3 text-xs text-[#99f6e4]">
              {initialMessage}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-[#8e95a2] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-[#8e95a2]"
                >
                  Password
                </label>
                <Link
                  href="/auth/reset-password"
                  className="text-xs text-[#99f6e4] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/15 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  Signing In...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-[#21252d] text-center text-xs text-[#8e95a2]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-[#99f6e4] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}