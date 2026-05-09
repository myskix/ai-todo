import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── If Supabase is not configured yet, skip auth logic ──────────────────────
  // This allows the app to render (especially /login) before credentials are set.
  if (!supabaseConfigured) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — do NOT remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in and visiting /login, redirect to /dashboard
  if (pathname === "/login" && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect root path to /dashboard
  if (pathname === "/") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // Optional: Strictly protect certain routes if needed (e.g., /settings)
  // For now, AuthGuard handles the "Guest Mode" banner on /dashboard and /calendar
  // We allow /settings to be accessed by guests too, so no redirect here.

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
