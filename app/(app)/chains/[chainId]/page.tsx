import { redirect } from "next/navigation";

export default async function ChainIndexPage({
  params,
}: {
  params: Promise<{ chainId: string }>;
}) {
  const { chainId } = await params;
  redirect(`/chains/${chainId}/overview`);
}
