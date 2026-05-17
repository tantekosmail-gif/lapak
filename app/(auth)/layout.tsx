import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              Nusantara Batik
            </h1>
          </Link>
          <p className="text-muted mt-2 text-sm">
            Temukan koleksi batik berkualitas tinggi dari pengrajin terbaik Indonesia
          </p>
        </div>

        {/* Card */}
        <div className="bg-canvas rounded-lg border border-hairline p-8 sm:p-10">
          {children}
        </div>
      </div>
    </main>
  );
}