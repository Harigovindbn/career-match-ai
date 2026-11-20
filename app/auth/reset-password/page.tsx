"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import AuthCard, { AuthNotice, authButtonClass, authInputClass } from "@/components/auth/AuthCard";
import { requestPasswordReset, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null, success: null };

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  return (
    <AuthCard title="Reset your password" subtitle="Enter your account email and we'll send you a reset link.">
      <AuthNotice error={state.error} success={state.success} />
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#8e95a2]">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8e95a2]">
              <Mail className="h-4 w-4" />
            </div>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={authInputClass} />
          </div>
        </div>
        <button type="submit" disabled={isPending} className={authButtonClass}>
          {isPending ? (
            <>Sending link... <Loader2 className="h-4 w-4 animate-spin" /></>
          ) : (
            <>Send reset link <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
