"use server";

import { redirect } from "next/navigation";

import { getRequestOrigin } from "@/lib/auth/origin";
import { createClient } from "@/lib/supabase/server";

export type SignUpState = { error: string | null };

export async function signUp(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const fullName = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !fullName.trim() ||
    !email.trim() ||
    !password.trim()
  ) {
    return { error: "Please complete all fields." };
  }

  if (password.length < 8) {
    return { error: "Password must contain at least 8 characters." };
  }

  const supabase = await createClient();
  const origin = await getRequestOrigin();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is disabled, Supabase signs the user in immediately.
  if (data.session) {
    redirect("/dashboard");
  }

  redirect(`/auth/sign-up/success?email=${encodeURIComponent(email.trim())}`);
}
