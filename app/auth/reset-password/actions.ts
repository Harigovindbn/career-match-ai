"use server";

import { redirect } from "next/navigation";

import { getRequestOrigin } from "@/lib/auth/origin";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string | null; success: string | null };

export async function requestPasswordReset(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Please enter your email address.", success: null };
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  // Same message whether or not the account exists, to avoid leaking which emails are registered.
  return {
    error: null,
    success: "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function updatePasswordFromReset(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  if (typeof password !== "string" || password.length < 8) {
    return { error: "Password must contain at least 8 characters.", success: null };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match.", success: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset link has expired. Please request a new one.",
      success: null,
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, success: null };
  }

  redirect("/dashboard");
}
