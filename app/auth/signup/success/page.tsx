"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Insert your authentication/Supabase signup logic here
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
            Create an account
          </h2>
          <p className="text-sm text-[#8e95a2]">
            Start optimizing your resume and discovering job matches
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-[#21252d] bg-[#121417] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-medium uppercase tracking-wider text-[#8e95a2] mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#21252d] bg-[#181b20] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8e95a2]/50 outline-none transition focus:border-[#99f6e4] focus:ring-1 focus:ring-[#99f6e4]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-[#8e95a2] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e95a2]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#99f6e4] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] shadow-lg shadow-[#99f6e4]/10"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-[#21252d] text-center text-xs text-[#8e95a2]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#99f6e4] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}