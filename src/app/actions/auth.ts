"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Get user profile to determine redirect destination.
  // Return the URL instead of calling redirect() — when redirect() is called
  // inside a server action invoked from a Client Component via fetch, Chrome
  // aborts the request before committing the set-cookie headers, so the new
  // session token is never stored.  The client must do window.location.href.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (profile?.role === "super_admin") {
      return { redirect: "/admin/dashboard" };
    } else if (profile?.role === "shop_owner") {
      if (profile.status === "pending") {
        return { redirect: "/owner/pending" };
      }
      return { redirect: "/owner/dashboard" };
    }
  }

  return { redirect: "/dashboard" };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = (formData.get("role") as string) || "student";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (role === "shop_owner") {
    return { success: true, pending: true };
  }

  // Auto-login the student immediately after signup
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    // Signup succeeded but login failed — fall back to success screen
    return { success: true, pending: false };
  }

  return { success: true, pending: false, redirect: "/dashboard" };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    // Return the URL so the client can do a hard navigation (window.location.href)
    // ensuring cookies are applied before the OAuth redirect.
    return { url: data.url };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
