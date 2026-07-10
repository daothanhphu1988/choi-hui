import {
  LayoutDashboard,
  Layers,
  Users,
  Wallet,
  BarChart3,
  History,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/supabase/types";
import { STAFF_ROLES, MANAGER_ROLES } from "@/lib/auth/role-labels";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Omit to allow every role. */
  roles?: UserRole[];
}

export const navItems: NavItem[] = [
  { title: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { title: "Dây hụi", href: "/chains", icon: Layers },
  { title: "Thành viên", href: "/members", icon: Users, roles: STAFF_ROLES },
  { title: "Thanh toán", href: "/payments", icon: Wallet, roles: STAFF_ROLES },
  { title: "Báo cáo", href: "/reports", icon: BarChart3, roles: STAFF_ROLES },
  {
    title: "Nhật ký hoạt động",
    href: "/activity-log",
    icon: History,
    roles: MANAGER_ROLES,
  },
  {
    title: "Người dùng",
    href: "/settings/users",
    icon: UserCog,
    roles: ["chu_hui"],
  },
];

export function filterNavByRole(role: UserRole): NavItem[] {
  return navItems.filter((item) => !item.roles || item.roles.includes(role));
}
