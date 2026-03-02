import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default async function StudentLayout({
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

  if (!profile || profile.role !== "student") {
    redirect("/login");
  }

  const navItems = [
    { href: "/shops", label: "Shops", icon: "Store" as const },
    { href: "/leaderboard", label: "Leaderboard", icon: "Trophy" as const },
    { href: "/my-reviews", label: "My Reviews", icon: "MessageSquare" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar
        navItems={navItems}
        profile={profile}
        role="student"
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav navItems={navItems} />
    </div>
  );
}
