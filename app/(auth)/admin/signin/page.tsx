"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const ADMIN_INTENT_COOKIE = "lapak_admin_intent";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AdminSignInForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    document.cookie = `${ADMIN_INTENT_COOKIE}=1; path=/; max-age=300; SameSite=Lax`;
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  const errorMessage =
    errorParam === "NotAdmin"
      ? "Akun Google Anda belum terdaftar sebagai admin. Silakan hubungi administrator."
      : errorParam
        ? "Gagal masuk dengan Google. Silakan coba lagi."
        : null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink mb-1">Masuk Admin</h2>
      <p className="text-muted text-sm mb-8">
        Hanya akun yang telah ditetapkan sebagai admin yang dapat masuk ke dashboard.
      </p>

      {errorMessage && (
        <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 mb-6">
          <p className="text-error text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-12 rounded-lg border border-hairline bg-canvas text-ink font-medium text-base flex items-center justify-center gap-3 transition-colors hover:bg-surface active:bg-surface disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <GoogleIcon />
        <span>{isLoading ? "Memproses..." : "Lanjutkan dengan Google"}</span>
      </button>

      <p className="text-center text-xs text-muted mt-8">
        Admin tidak dapat didaftarkan dari halaman ini. Akses admin hanya bisa
        diberikan melalui promosi akun yang sudah ada.
      </p>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense>
      <AdminSignInForm />
    </Suspense>
  );
}
