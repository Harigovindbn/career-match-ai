"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getOptionalValue(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
}

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const fullName = getOptionalValue(formData, "full_name");

  if (!fullName) {
    redirect("/profile?error=full-name-required");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      professional_title: getOptionalValue(
        formData,
        "professional_title",
      ),
      phone: getOptionalValue(formData, "phone"),
      location: getOptionalValue(formData, "location"),
      bio: getOptionalValue(formData, "bio"),
      linkedin_url: getOptionalValue(formData, "linkedin_url"),
      github_url: getOptionalValue(formData, "github_url"),
      portfolio_url: getOptionalValue(formData, "portfolio_url"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update failed:", error);
    redirect("/profile?error=update-failed");
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  redirect("/profile?saved=true");
}