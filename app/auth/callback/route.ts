import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler — exchanges the code for a user session.
 * Supabase redirects to /auth/callback?code=... after the OAuth flow.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default redirect to dashboard
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the app after successful login
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }
    console.error("Auth callback error:", error);
  }

  // On error — redirect to login with an error flag
  const errorUrl = new URL("/login?error=auth_callback_failed", origin);
  return NextResponse.redirect(errorUrl);
}
