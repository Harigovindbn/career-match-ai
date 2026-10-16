"use server";

export async function updateUserSettings(formData: {
  name: string;
  email: string;
  emailNotifications: boolean;
  aiAssistantTips: boolean;
  theme: string;
}) {
  // Simulate network latency / database write
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Basic validation example
  if (!formData.email || !formData.email.includes("@")) {
    return { success: false, error: "Invalid email address provided." };
  }

  // Here you would normally update your database:
  // await db.user.update({ where: ..., data: formData })

  return { success: true, message: "Settings updated successfully." };
}

export async function updatePassword(formData: {
  currentPassword: string;
  newPassword: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!formData.currentPassword || formData.newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  return { success: true, message: "Password updated successfully." };
}