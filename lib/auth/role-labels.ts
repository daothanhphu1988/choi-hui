import type { UserRole } from "@/lib/supabase/types";

export const roleLabels: Record<UserRole, string> = {
  chu_hui: "Chủ hụi",
  pho_chu_hui: "Phó chủ hụi",
  ke_toan: "Kế toán",
  thanh_vien: "Thành viên",
};

export const MANAGER_ROLES: UserRole[] = ["chu_hui", "pho_chu_hui"];
export const STAFF_ROLES: UserRole[] = ["chu_hui", "pho_chu_hui", "ke_toan"];
