import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove this line — it refreshes the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/auth/callback", "/"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/auth/")
  );

  // Helper: redirect while preserving refreshed session cookies
  // This is critical — a plain NextResponse.redirect() discards cookies
  // refreshed by supabase.auth.getUser(), breaking the session.
  function redirectWithCookies(destination: string) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...rest }) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.cookies.set(name, value, rest as any)
    );
    return res;
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    return redirectWithCookies("/login");
  }

  // If user is authenticated, enforce role-based access
  if (user) {
    // Fetch user profile to get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const status = profile?.status;

    // Redirect authenticated users away from auth pages.
    // Guard with `profile` so we don't loop when the DB trigger is delayed.
    if (isPublicRoute && pathname !== "/" && profile) {
      if (role === "super_admin") {
        return redirectWithCookies("/admin/dashboard");
      } else if (role === "shop_owner" && status === "active") {
        return redirectWithCookies("/owner/dashboard");
      } else if (role === "shop_owner" && status === "pending") {
        return redirectWithCookies("/owner/pending");
      } else {
        return redirectWithCookies("/dashboard");
      }
    }

    // Role-based route protection
    if (pathname.startsWith("/admin") && role !== "super_admin") {
      return redirectWithCookies("/dashboard");
    }

    if (pathname.startsWith("/owner")) {
      if (role !== "shop_owner") {
        return redirectWithCookies("/dashboard");
      }
      if (status === "pending" && !pathname.startsWith("/owner/pending")) {
        return redirectWithCookies("/owner/pending");
      }
    }
  }

  return supabaseResponse;
}
