import { requireProfile } from "@/lib/auth/roles";

export default async function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireProfile();
  return <div className="mx-auto max-w-md p-6 print:p-0">{children}</div>;
}
