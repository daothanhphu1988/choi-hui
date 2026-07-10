import { createClient } from "@/lib/supabase/server";

export interface IncomeExpenseRow {
  chainId: string;
  chainName: string;
  totalDue: number;
  totalPaid: number;
  outstanding: number;
}

export interface WinHistoryRow {
  id: string;
  chainName: string;
  periodNo: number;
  memberName: string;
  amount: number | null;
  bidAmount: number | null;
  closedAt: string | null;
}

export interface DebtReportRow {
  chainId: string;
  chainName: string;
  memberId: string;
  memberName: string;
  totalOwed: number;
  totalPaid: number;
}

export interface MemberReportRow {
  memberId: string;
  fullName: string;
  phone: string | null;
  status: string;
  chainCount: number;
  shareCount: number;
}

export async function getReportsData() {
  const supabase = await createClient();

  const [
    { data: chains },
    { data: periods },
    { data: chainMembers },
    { data: members },
    { data: shares },
    { data: payments },
    { data: memberDebt },
  ] = await Promise.all([
    supabase.from("hui_chains").select("*"),
    supabase.from("periods").select("*"),
    supabase.from("chain_members").select("*"),
    supabase.from("members").select("*"),
    supabase.from("chain_shares").select("*"),
    supabase.from("payments").select("*"),
    supabase.from("v_member_debt").select("*"),
  ]);

  const chainById = new Map((chains ?? []).map((c) => [c.id, c]));
  const periodById = new Map((periods ?? []).map((p) => [p.id, p]));
  const chainMemberById = new Map((chainMembers ?? []).map((cm) => [cm.id, cm]));
  const memberById = new Map((members ?? []).map((m) => [m.id, m]));

  // --- Income/expense: sum payments due/paid per chain ---
  const incomeByChain = new Map<string, { due: number; paid: number }>();
  for (const p of payments ?? []) {
    const period = periodById.get(p.period_id);
    if (!period) continue;
    const entry = incomeByChain.get(period.chain_id) ?? { due: 0, paid: 0 };
    entry.due += p.amount_due;
    entry.paid += p.amount_paid;
    incomeByChain.set(period.chain_id, entry);
  }
  const incomeExpense: IncomeExpenseRow[] = (chains ?? []).map((chain) => {
    const entry = incomeByChain.get(chain.id) ?? { due: 0, paid: 0 };
    return {
      chainId: chain.id,
      chainName: chain.name,
      totalDue: entry.due,
      totalPaid: entry.paid,
      outstanding: entry.due - entry.paid,
    };
  });

  // --- Win history: shares that have won, newest first ---
  const winHistory: WinHistoryRow[] = (shares ?? [])
    .filter((s) => s.won_period_id)
    .map((s) => {
      const period = s.won_period_id ? periodById.get(s.won_period_id) : undefined;
      const chain = period ? chainById.get(period.chain_id) : undefined;
      const chainMember = chainMemberById.get(s.chain_member_id);
      const member = chainMember ? memberById.get(chainMember.member_id) : undefined;
      return {
        id: s.id,
        chainName: chain?.name ?? "—",
        periodNo: period?.period_no ?? 0,
        memberName: member?.full_name ?? "—",
        amount: s.won_amount,
        bidAmount: period?.winning_bid_amount ?? null,
        closedAt: period?.closed_at ?? null,
      };
    })
    .sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""));

  // --- Debt report: v_member_debt + names, only meaningful rows first ---
  const debtReport: DebtReportRow[] = (memberDebt ?? [])
    .map((d) => ({
      chainId: d.chain_id,
      chainName: chainById.get(d.chain_id)?.name ?? "—",
      memberId: d.member_id,
      memberName: d.full_name,
      totalOwed: d.total_owed,
      totalPaid: d.total_paid,
    }))
    .sort((a, b) => b.totalOwed - a.totalOwed);

  // --- Member report: chains joined + total shares held ---
  const chainCountByMember = new Map<string, Set<string>>();
  const shareCountByMember = new Map<string, number>();
  for (const cm of chainMembers ?? []) {
    const set = chainCountByMember.get(cm.member_id) ?? new Set<string>();
    set.add(cm.chain_id);
    chainCountByMember.set(cm.member_id, set);
  }
  for (const s of shares ?? []) {
    const chainMember = chainMemberById.get(s.chain_member_id);
    if (!chainMember) continue;
    shareCountByMember.set(
      chainMember.member_id,
      (shareCountByMember.get(chainMember.member_id) ?? 0) + 1,
    );
  }
  const memberReport: MemberReportRow[] = (members ?? []).map((m) => ({
    memberId: m.id,
    fullName: m.full_name,
    phone: m.phone,
    status: m.status,
    chainCount: chainCountByMember.get(m.id)?.size ?? 0,
    shareCount: shareCountByMember.get(m.id) ?? 0,
  }));

  return { incomeExpense, winHistory, debtReport, memberReport };
}
