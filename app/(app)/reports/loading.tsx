import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="flex justify-between">
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <TableSkeleton rows={6} columns={4} />
    </div>
  );
}
