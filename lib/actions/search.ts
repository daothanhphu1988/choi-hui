"use server";

import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  type: "chain" | "member";
  id: string;
  title: string;
  subtitle?: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const supabase = await createClient();

  const [{ data: chains }, { data: members }] = await Promise.all([
    supabase.from("hui_chains").select("id, name").ilike("name", `%${q}%`).limit(6),
    supabase
      .from("members")
      .select("id, full_name, phone")
      .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)
      .limit(6),
  ]);

  const results: SearchResult[] = [];
  for (const chain of chains ?? []) {
    results.push({ type: "chain", id: chain.id, title: chain.name });
  }
  for (const member of members ?? []) {
    results.push({
      type: "member",
      id: member.id,
      title: member.full_name,
      subtitle: member.phone ?? undefined,
    });
  }
  return results;
}
