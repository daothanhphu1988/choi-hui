"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationBell } from "@/components/layout/notification-bell";
import { navItems } from "@/components/layout/nav-items";
import type { NotificationRow } from "@/lib/supabase/types";

function currentTitle(pathname: string): string {
  const match = navItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.title ?? "Quản Lý Chơi Hụi";
}

export function Topbar({ notifications }: { notifications: NotificationRow[] }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="hidden truncate text-sm font-medium text-foreground/90 sm:block">
        {currentTitle(pathname)}
      </h1>
      <div className="flex flex-1 justify-center sm:justify-end">
        <GlobalSearch />
      </div>
      <NotificationBell notifications={notifications} />
      <ThemeToggle />
      <Separator orientation="vertical" className="h-5" />
      <UserMenu />
    </header>
  );
}
