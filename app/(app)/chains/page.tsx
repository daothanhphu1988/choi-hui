import Link from "next/link";
import { Plus, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ChainsTable } from "@/components/chains/chains-table";

export default async function ChainsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("v_chain_dashboard")
    .select("*")
    .order("name");

  const chains = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dây hụi"
        description="Danh sách các dây hụi đang quản lý"
        action={
          <Button nativeButton={false} render={<Link href="/chains/new" />}>
            <Plus /> Tạo dây hụi
          </Button>
        }
      />
      {chains.length ? (
        <ChainsTable chains={chains} />
      ) : (
        <EmptyState
          icon={Layers}
          title="Chưa có dây hụi nào"
          description="Tạo dây hụi đầu tiên để bắt đầu quản lý thu chi và thành viên."
          action={
            <Button nativeButton={false} render={<Link href="/chains/new" />}>
              <Plus /> Tạo dây hụi
            </Button>
          }
        />
      )}
    </div>
  );
}
