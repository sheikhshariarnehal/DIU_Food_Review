import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fallback: if trigger hasn't fired yet, upsert a default profile
  if (!profile) {
    const { data: upserted } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        email: user.email || "",
        role: (user.user_metadata?.role as string) || "shop_owner",
        status: "pending",
        is_diu_verified: user.email?.endsWith("@diu.edu.bd") ?? false,
      }, { onConflict: "id" })
      .select("*")
      .single();
    profile = upserted;
  }

  if (!profile || profile.role !== "shop_owner") {
    redirect("/login");
  }

  // Shop owners that are pending can only see the pending page
  if (profile.status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pending Approval</h2>
          <p className="text-gray-600 text-sm">
            Your shop owner account is being reviewed by the admin. You&apos;ll receive access once approved.
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/owner/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
    { href: "/owner/shop", label: "My Shop", icon: "Store" as const },
    { href: "/owner/menu", label: "Menu", icon: "UtensilsCrossed" as const },
    { href: "/owner/reviews", label: "Reviews", icon: "MessageSquare" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        profile={profile}
        role="shop_owner"
      />

      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 sm:p-5 lg:p-5">{children}</div>
      </main>

      <BottomNav navItems={navItems} />
    </div>
  );
}
