"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message?: string; error?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateUserSettings(formData: {
  name: string;
  email: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const name = formData.name.trim();
  const email = formData.email.trim().toLowerCase();

  if (!name) {
    return { success: false, error: "Full name cannot be empty." };
  }
  if (name.length > 120) {
    return { success: false, error: "Full name must be 120 characters or fewer." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, full_name: name, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );

  if (profileError) {
    console.warn("Settings profile update failed:", profileError.message);
    return { success: false, error: "Your name could not be saved. Please try again." };
  }

  const emailChanged = email !== (user.email ?? "").toLowerCase();

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: name },
    ...(emailChanged ? { email } : {}),
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    message: emailChanged
      ? `Name saved. We sent a confirmation link to ${email}; your email changes once you confirm it.`
      : "Settings updated successfully.",
  };
}

export async function updateNotificationPreferences(prefs: {
  emailNotifications: boolean;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  const { error } = await supabase.auth.updateUser({
    data: { email_notifications: Boolean(prefs.emailNotifications) },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Notification preferences saved." };
}

export async function updatePassword(formData: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  if (!formData.currentPassword) {
    return { success: false, error: "Please enter your current password." };
  }
  if (formData.newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }
  if (formData.newPassword === formData.currentPassword) {
    return { success: false, error: "New password must be different from your current password." };
  }

  // Verify the current password before allowing a change.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: formData.currentPassword,
  });

  if (verifyError) {
    return { success: false, error: "Your current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: formData.newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Password changed successfully." };
}
