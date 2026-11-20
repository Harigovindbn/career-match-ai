import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return <LoginForm initialError={error ?? null} initialMessage={message ?? null} />;
}
