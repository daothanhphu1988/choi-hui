import { TableSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      <TableSkeleton rows={5} columns={6} />
    </div>
  );
}
