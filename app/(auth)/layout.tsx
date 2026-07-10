export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklch, var(--primary), transparent 88%), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklch, var(--primary), transparent 90%), transparent 50%)",
        }}
      />
      {children}
    </div>
  );
}
