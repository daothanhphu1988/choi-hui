"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { STAFF_ROLES } from "@/lib/auth/role-labels";

export type RecordPaymentState = { error?: string; success?: boolean } | undefined;

export async function recordPayment(
  _prevState: RecordPaymentState,
  formData: FormData,
): Promise<RecordPaymentState> {
  const profile = await requireRole(STAFF_ROLES);

  const paymentId = String(formData.get("paymentId") ?? "");
  const chainId = String(formData.get("chainId") ?? "");
  const amount = Number(formData.get("amount"));
  const method = String(formData.get("method") ?? "cash");
  const noteRaw = formData.get("note");
  const note = noteRaw ? String(noteRaw) : null;
  const file = formData.get("receipt");

  if (!paymentId || !Number.isFinite(amount) || amount <= 0) {
    return { error: "Số tiền không hợp lệ" };
  }

  const supabase = await createClient();

  let receiptPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    const path = `${paymentId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(path, file);
    if (uploadError) return { error: uploadError.message };
    receiptPath = path;
  }

  const { error } = await supabase.from("payment_records").insert({
    payment_id: paymentId,
    amount,
    method,
    note,
    receipt_url: receiptPath,
    recorded_by: profile.id,
  });

  if (error) return { error: error.message };

  await supabase.from("activity_log").insert({
    actor_id: profile.id,
    action: "payment.record",
    entity_type: "payment",
    entity_id: paymentId,
    metadata: { chain_id: chainId, amount },
  });

  await supabase.from("notifications").insert({
    type: "payment_recorded",
    title: "Đã ghi nhận đóng tiền",
    body: `Đã ghi nhận ${new Intl.NumberFormat("vi-VN").format(amount)}đ`,
    chain_id: chainId || null,
  });

  revalidatePath(`/chains/${chainId}/payments`);
  revalidatePath("/payments");
  revalidatePath("/dashboard");
  revalidatePath("/", "layout");

  return { success: true };
}

export async function getReceiptSignedUrls(
  paths: string[],
): Promise<Record<string, string>> {
  if (!paths.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("receipts")
    .createSignedUrls(paths, 60 * 60);

  if (error || !data) return {};

  const result: Record<string, string> = {};
  for (const item of data) {
    if (item.signedUrl && item.path) result[item.path] = item.signedUrl;
  }
  return result;
}
