// Hand-written to match supabase/migrations/*.sql. Regenerate with
// `supabase gen types typescript` once the project is linked, and this file
// can be replaced wholesale.
//
// NOTE: table/view row shapes must be declared with `type` (object literal),
// not `interface` — postgrest-js's GenericTable/GenericView constraints are
// checked structurally against Record<string, unknown>, and TypeScript only
// treats plain type-literal aliases (not named interfaces) as satisfying an
// index signature in that position. Using `interface` here silently makes
// every table's Row/Insert/Update resolve to `never`.

export type UserRole = "chu_hui" | "pho_chu_hui" | "ke_toan" | "thanh_vien";
export type ChainType = "lai" | "khong_lai";
export type CycleType = "weekly" | "biweekly" | "monthly";
export type ChainStatus = "draft" | "active" | "completed" | "cancelled";
export type PeriodStatus = "pending" | "open" | "closed";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type BidSplitRule = "equal";
export type MemberStatus = "active" | "inactive";
export type NotificationType =
  | "payment_due"
  | "chain_opening"
  | "overdue"
  | "confirmation"
  | "period_closed"
  | "payment_recorded";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  member_id: string | null;
  created_at: string;
};

export type Member = {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  note: string | null;
  status: MemberStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type HuiChain = {
  id: string;
  name: string;
  owner_id: string;
  type: ChainType;
  share_value: number;
  cycle: CycleType;
  start_date: string;
  total_shares: number;
  bid_split_rule: BidSplitRule;
  status: ChainStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type ChainMember = {
  id: string;
  chain_id: string;
  member_id: string;
  joined_at: string;
  note: string | null;
};

export type ChainShare = {
  id: string;
  chain_id: string;
  chain_member_id: string;
  share_no: number;
  won_period_id: string | null;
  won_amount: number | null;
  created_at: string;
};

export type Period = {
  id: string;
  chain_id: string;
  period_no: number;
  open_date: string;
  close_date: string;
  status: PeriodStatus;
  total_fund: number | null;
  winning_bid_amount: number | null;
  note: string | null;
  closed_by: string | null;
  closed_at: string | null;
  created_at: string;
};

export type PeriodBid = {
  id: string;
  period_id: string;
  chain_share_id: string;
  bid_amount: number;
  created_at: string;
};

export type PeriodBidDistribution = {
  id: string;
  period_id: string;
  chain_share_id: string;
  amount: number;
  created_at: string;
};

export type Payment = {
  id: string;
  period_id: string;
  chain_share_id: string;
  amount_due: number;
  amount_paid: number;
  status: PaymentStatus;
  due_date: string;
  updated_at: string;
};

export type PaymentRecord = {
  id: string;
  payment_id: string;
  amount: number;
  paid_at: string;
  method: string | null;
  receipt_url: string | null;
  recorded_by: string;
  note: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  profile_id: string | null;
  type: NotificationType;
  title: string;
  body: string | null;
  chain_id: string | null;
  period_id: string | null;
  is_read: boolean;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type ChainDashboardView = {
  chain_id: string;
  name: string;
  status: ChainStatus;
  type: ChainType;
  cycle: CycleType;
  share_value: number;
  start_date: string;
  total_shares: number;
  member_count: number;
  total_fund_value: number;
  shares_won: number;
  shares_remaining: number;
};

export type MemberDebtView = {
  chain_id: string;
  member_id: string;
  full_name: string;
  total_shares: number;
  shares_won: number;
  total_due: number;
  total_paid: number;
  total_owed: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; full_name: string }; Update: Partial<Profile>; Relationships: [] };
      members: { Row: Member; Insert: Partial<Member> & { full_name: string }; Update: Partial<Member>; Relationships: [] };
      hui_chains: { Row: HuiChain; Insert: Partial<HuiChain> & { name: string; owner_id: string; type: ChainType; share_value: number; cycle: CycleType; start_date: string; total_shares: number }; Update: Partial<HuiChain>; Relationships: [] };
      chain_members: { Row: ChainMember; Insert: Partial<ChainMember> & { chain_id: string; member_id: string }; Update: Partial<ChainMember>; Relationships: [] };
      chain_shares: { Row: ChainShare; Insert: Partial<ChainShare> & { chain_id: string; chain_member_id: string; share_no: number }; Update: Partial<ChainShare>; Relationships: [] };
      periods: { Row: Period; Insert: Partial<Period> & { chain_id: string; period_no: number; open_date: string; close_date: string }; Update: Partial<Period>; Relationships: [] };
      period_bids: { Row: PeriodBid; Insert: Partial<PeriodBid> & { period_id: string; chain_share_id: string; bid_amount: number }; Update: Partial<PeriodBid>; Relationships: [] };
      period_bid_distributions: { Row: PeriodBidDistribution; Insert: Partial<PeriodBidDistribution> & { period_id: string; chain_share_id: string; amount: number }; Update: Partial<PeriodBidDistribution>; Relationships: [] };
      payments: { Row: Payment; Insert: Partial<Payment> & { period_id: string; chain_share_id: string; amount_due: number; due_date: string }; Update: Partial<Payment>; Relationships: [] };
      payment_records: { Row: PaymentRecord; Insert: Partial<PaymentRecord> & { payment_id: string; amount: number; recorded_by: string }; Update: Partial<PaymentRecord>; Relationships: [] };
      notifications: { Row: NotificationRow; Insert: Partial<NotificationRow> & { type: NotificationType; title: string }; Update: Partial<NotificationRow>; Relationships: [] };
      activity_log: { Row: ActivityLog; Insert: Partial<ActivityLog> & { action: string; entity_type: string }; Update: Partial<ActivityLog>; Relationships: [] };
    };
    Views: {
      v_chain_dashboard: { Row: ChainDashboardView; Relationships: [] };
      v_member_debt: { Row: MemberDebtView; Relationships: [] };
    };
    Functions: {
      open_period: {
        Args: { p_chain_id: string; p_period_no: number; p_open_date: string; p_close_date: string };
        Returns: string;
      };
      close_period: {
        Args: { p_period_id: string; p_winner_share_id: string; p_bid_amount?: number | null };
        Returns: void;
      };
    };
  };
};
