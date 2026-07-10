import { requireProfile } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { ProfileProvider } from "@/components/layout/role-context";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .or(`profile_id.eq.${profile.id},profile_id.is.null`)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <ProfileProvider profile={profile}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar notifications={notifications ?? []} />
          <div className="flex-1 space-y-6 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
