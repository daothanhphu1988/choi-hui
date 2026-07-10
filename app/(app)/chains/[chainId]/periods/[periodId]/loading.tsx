import { Skeleton } from "@/components/ui/skeleton";
import { DetailCardSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
      <DetailCardSkeleton />
    </div>
  );
}
