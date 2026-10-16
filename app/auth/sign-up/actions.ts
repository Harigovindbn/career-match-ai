"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const fullName = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    redirect("/auth/signup?error=Please complete all fields");
  }

  if (!fullName.trim() || !email.trim() || !password.trim()) {
    redirect("/auth/signup?error=Please complete all fields");
  }

  if (password.length < 8) {
    redirect("/auth/signup?error=Password must contain at least 8 characters");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/signup/success");
}