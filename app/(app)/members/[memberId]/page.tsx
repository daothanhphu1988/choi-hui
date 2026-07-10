import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberStatusBadge } from "@/components/members/member-status-badge";
import { formatVND } from "@/lib/utils/currency";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const supabase = await createClient();

  const [{ data: member }, { data: debt }] = await Promise.all([
    supabase.from("members").select("*").eq("id", memberId).single(),
    supabase.from("v_member_debt").select("*").eq("member_id", memberId),
  ]);

  if (!member) notFound();

  const debtRows = debt ?? [];
  const chainIds = debtRows.map((d) => d.chain_id);
  const { data: chains } = chainIds.length
    ? await supabase.from("hui_chains").select("id, name").in("id", chainIds)
    : { data: [] };
  const chainById = new Map((chains ?? []).map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <PageHeader title={member.full_name} description={member.phone ?? undefined} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <div className="mt-1">
              <MemberStatusBadge status={member.status} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Địa chỉ</p>
            <p className="mt-1 text-sm font-medium">{member.address || "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ghi chú</p>
            <p className="mt-1 text-sm font-medium">{member.note || "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tham gia dây hụi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {debtRows.length ? (
            debtRows.map((d) => {
              const chain = chainById.get(d.chain_id);
              return (
                <Link
                  key={d.chain_id}
                  href={`/chains/${d.chain_id}`}
                  className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{chain?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.total_shares} phần · {d.shares_won} đã hốt
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span>Đã góp: {formatVND(d.total_paid)}</span>
                    <Badge variant={d.total_owed > 0 ? "destructive" : "outline"}>
                      Còn nợ: {formatVND(d.total_owed)}
                    </Badge>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa tham gia dây hụi nào.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
