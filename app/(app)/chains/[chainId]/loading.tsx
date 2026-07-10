import { Skeleton } from "@/components/ui/skeleton";
import { ChainHeaderSkeleton, TableSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ChainHeaderSkeleton />
      <Skeleton className="h-9 w-72 rounded-lg" />
      <TableSkeleton rows={4} columns={4} />
    </div>
  );
}
