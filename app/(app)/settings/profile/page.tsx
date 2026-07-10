import { requireProfile } from "@/lib/auth/roles";
import { roleLabels } from "@/lib/auth/role-labels";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

export default async function ProfileSettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader
        title="Hồ sơ cá nhân"
        description={`Vai trò: ${roleLabels[profile.role]}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              full_name: profile.full_name,
              phone: profile.phone ?? "",
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
