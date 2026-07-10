import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ChainForm } from "@/components/chains/chain-form";
import { createChain } from "@/lib/actions/chains";

export default function NewChainPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Tạo dây hụi mới"
        description="Nhập thông tin dây hụi để bắt đầu quản lý"
      />
      <Card>
        <CardContent className="pt-6">
          <ChainForm onSubmit={createChain} submitLabel="Tạo dây hụi" />
        </CardContent>
      </Card>
    </div>
  );
}
