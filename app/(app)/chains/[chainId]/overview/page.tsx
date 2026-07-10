import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChainOverviewPage({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ghi chú / quy định chia tiền bỏ hụi</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {chain?.note || "Chưa có ghi chú."}
        </p>
      </CardContent>
    </Card>
  );
}
