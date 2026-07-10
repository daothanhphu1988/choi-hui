import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={10} columns={4} />
    </div>
  );
}
