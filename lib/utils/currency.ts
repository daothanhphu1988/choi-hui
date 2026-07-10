const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function formatVND(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return currencyFormatter.format(amount);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return numberFormatter.format(value);
}

/** Strips everything but digits, for parsing a VND-formatted input back to a number. */
export function parseVND(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
