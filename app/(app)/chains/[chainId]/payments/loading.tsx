import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
      </div>
      <TableSkeleton rows={6} columns={6} />
    </div>
  );
}
