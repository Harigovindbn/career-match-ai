"use client";

import { useActionState } from "react";
import { Loader2, Lock, Save } from "lucide-react";

import AuthCard, { AuthNotice, authButtonClass, authInputClass } from "@/components/auth/AuthCard";
import { updatePasswordFromReset, type AuthFormState } from "../reset-password/actions";

const initialState: AuthFormState = { error: null, success: null };

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePasswordFromReset, initialState);

  return (
    <AuthCard title="Choose a new password" subtitle="Enter a new password for your account.">
      <AuthNotice error={state.error} success={state.success} />
      <form action={formAction} className="space-y-5">
        {[
          { id: "password", label: "New password" },
          { id: "confirm", label: "Confirm new password" },
        ].map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#8e95a2]">
              {field.label}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8e95a2]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id={field.id}
                name={field.id}
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                className={authInputClass}
              />
            </div>
          </div>
        ))}
        <button type="submit" disabled={isPending} className={authButtonClass}>
          {isPending ? (
            <>Saving... <Loader2 className="h-4 w-4 animate-spin" /></>
          ) : (
            <>Update password <Save className="h-4 w-4" /></>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
