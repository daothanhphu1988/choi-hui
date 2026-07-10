import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChainForm } from "@/components/chains/chain-form";
import { DeleteChainButton } from "@/components/chains/delete-chain-button";
import { updateChain } from "@/lib/actions/chains";
import type { ChainFormValues } from "@/lib/validations/chain.schema";

export default async function EditChainPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  const supabase = await createClient();
  const { data: chain } = await supabase
    .from("hui_chains")
    .select("*")
    .eq("id", chainId)
    .single();

  if (!chain) notFound();

  async function handleSubmit(values: ChainFormValues) {
    "use server";
    await updateChain(chainId, values);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Chỉnh sửa dây hụi" description={chain.name} />
      <Card>
        <CardContent className="pt-6">
          <ChainForm
            defaultValues={{
              name: chain.name,
              type: chain.type,
              share_value: chain.share_value,
              cycle: chain.cycle,
              start_date: chain.start_date,
              total_shares: chain.total_shares,
              note: chain.note ?? "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Lưu thay đổi"
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
          <CardDescription>
            Xóa dây hụi sẽ xóa toàn bộ dữ liệu liên quan và không thể khôi phục.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteChainButton chainId={chainId} chainName={chain.name} />
        </CardContent>
      </Card>
    </div>
  );
}
