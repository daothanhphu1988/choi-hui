import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-gold text-primary-foreground shadow-lg shadow-primary/25",
        className,
      )}
    >
      <PiggyBank className={cn("size-6", iconClassName)} />
    </div>
  );
}
