import { addWeeks, addMonths, format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { CycleType } from "@/lib/supabase/types";

export function nextCycleDate(date: Date, cycle: CycleType): Date {
  switch (cycle) {
    case "weekly":
      return addWeeks(date, 1);
    case "biweekly":
      return addWeeks(date, 2);
    case "monthly":
      return addMonths(date, 1);
  }
}

export function formatDate(
  date: string | Date | null | undefined,
  pattern = "dd/MM/yyyy",
): string {
  if (!date) return "—";
  return format(new Date(date), pattern, { locale: vi });
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
}

export const cycleLabels: Record<CycleType, string> = {
  weekly: "Hàng tuần",
  biweekly: "Nửa tháng",
  monthly: "Hàng tháng",
};
