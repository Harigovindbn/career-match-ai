import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/** Only allow redirects to same-site paths to avoid open redirects. */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

/**
 * Handles links from Supabase auth emails (sign-up confirmation, password reset).
 * Supports both the PKCE `code` flow and the `token_hash` OTP flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  const supabase = await createClient();

  let error: { message: string } | null = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else {
    error = { message: "The link is invalid or incomplete." };
  }

  if (error) {
    const message = encodeURIComponent(
      `${error.message} The link may have expired; please request a new one.`,
    );
    return NextResponse.redirect(`${origin}/auth/login?error=${message}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
