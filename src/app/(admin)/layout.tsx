import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default async function AdminLayout({
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
        role: (user.user_metadata?.role as string) || "student",
        status: "active",
        is_diu_verified: user.email?.endsWith("@diu.edu.bd") ?? false,
      }, { onConflict: "id" })
      .select("*")
      .single();
    profile = upserted;
  }

  if (!profile || profile.role !== "super_admin") {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
    { href: "/admin/shops", label: "Shops", icon: "Store" as const },
    { href: "/admin/users", label: "Users", icon: "Users" as const },
    { href: "/admin/approvals", label: "Approvals", icon: "ClipboardCheck" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        profile={profile}
        role="super_admin"
      />

      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 sm:p-5 lg:p-5">{children}</div>
      </main>

      <BottomNav navItems={navItems} />
    </div>
  );
}
