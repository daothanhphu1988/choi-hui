"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "overview", label: "Tổng quan" },
  { href: "members", label: "Thành viên" },
  { href: "periods", label: "Kỳ hụi" },
  { href: "payments", label: "Thanh toán" },
];

export function ChainTabs({ chainId }: { chainId: string }) {
  const pathname = usePathname();

  return (
    <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px]">
      {tabs.map((tab) => {
        const href = `/chains/${chainId}/${tab.href}`;
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={tab.href}
            href={href}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
