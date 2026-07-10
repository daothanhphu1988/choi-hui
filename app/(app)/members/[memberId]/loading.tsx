import { PageHeaderSkeleton, CardGridSkeleton, DetailCardSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <CardGridSkeleton count={3} />
      <DetailCardSkeleton />
    </div>
  );
}
