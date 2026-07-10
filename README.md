# Sổ Hụi

Webapp quản lý dây hụi (Vietnamese ROSCA): dây hụi, thành viên, kỳ hụi, hốt hụi (bốc thăm & đấu giá), thanh toán, công nợ, báo cáo, nhật ký hoạt động, thông báo, phân quyền, tìm kiếm.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · shadcn/ui · Supabase (Postgres, Auth, Storage)

## 1. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com) (or use an existing one).
2. In the SQL Editor, run every file in `supabase/migrations/` **in order** (`0001_...` through `0014_...`). If you have the Supabase CLI linked to this project, `supabase db push` works too.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — same page (server-only, used to provision new user accounts in Settings → Người dùng).
4. Create your first `chu_hui` (owner) account: sign the user up via the Supabase Auth dashboard (or `supabase.auth.admin.createUser`), then update that row in the `profiles` table to `role = 'chu_hui'`. Every subsequent account can be provisioned from inside the app at **Cài đặt → Người dùng**.

## 2. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on `/login`.

## 3. Notes on scope

- **Notifications** are in-app only (no real SMS/Zalo integration) — the schema (`notification_type`) supports adding real providers later without UI changes.
- **Excel/PDF export** buttons on the Reports page are present but disabled (stubbed) for a future pass.
- **Roles**: `chu_hui`, `pho_chu_hui`, `ke_toan`, `thanh_vien` — enforced both in Server Actions (`lib/auth/roles.ts`) and via Postgres Row Level Security (`supabase/migrations/0013_rls_policies.sql`).
- Winner selection (`close_period`) and period creation (`open_period`) are atomic Postgres functions (`supabase/migrations/0012_functions.sql`) called via `supabase.rpc()` — this is the only path that mutates who has won.
