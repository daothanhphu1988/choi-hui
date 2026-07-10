"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels } from "@/lib/auth/role-labels";
import { updateUserRole } from "@/lib/actions/users";
import type { Profile, UserRole } from "@/lib/supabase/types";

const allRoles: UserRole[] = ["chu_hui", "pho_chu_hui", "ke_toan", "thanh_vien"];

export function UsersTable({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();

  async function handleRoleChange(profileId: string, role: UserRole) {
    try {
      await updateUserRole(profileId, role);
      toast.success("Đã cập nhật vai trò");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="p-2 text-left font-medium">Họ tên</th>
            <th className="p-2 text-left font-medium">SĐT</th>
            <th className="p-2 text-left font-medium">Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id} className="border-t">
              <td className="p-2">
                {profile.full_name}
                {profile.id === currentUserId ? (
                  <span className="ml-1 text-xs text-muted-foreground">(bạn)</span>
                ) : null}
              </td>
              <td className="p-2">{profile.phone || "—"}</td>
              <td className="p-2">
                <Select
                  value={profile.role}
                  onValueChange={(value) =>
                    value && handleRoleChange(profile.id, value as UserRole)
                  }
                  disabled={profile.id === currentUserId}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue>{(value: UserRole) => roleLabels[value]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
