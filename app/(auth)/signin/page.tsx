"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type SigninFormData = {
  email: string;
  password: string;
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SigninFormData) {
    setServerError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Email atau kata sandi salah");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink mb-1">Masuk</h2>
      <p className="text-muted text-sm mb-8">
        Selamat datang kembali! Masuk ke akun Anda.
      </p>

      {registered && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-green-700 text-sm">
            Akun berhasil dibuat! Silakan masuk.
          </p>
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 mb-6">
          <p className="text-error text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="nama@email.com"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email tidak valid",
              },
            })}
            className="w-full h-14 px-3.5 rounded-lg border border-hairline bg-canvas text-ink text-base placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
          />
          {errors.email && (
            <p className="text-error text-xs mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              {...register("password", {
                required: "Kata sandi wajib diisi",
                minLength: {
                  value: 6,
                  message: "Kata sandi minimal 6 karakter",
                },
              })}
              className="w-full h-14 px-3.5 pr-12 rounded-lg border border-hairline bg-canvas text-ink text-base placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-xs mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-medium text-base transition-colors hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hairline" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-canvas px-4 text-muted">atau</span>
        </div>
      </div>

      {/* Forgot password */}
      <p className="text-center text-sm text-muted">
        Lupa kata sandi?{" "}
        <Link
          href="/forgot-password"
          className="text-ink font-medium underline underline-offset-2 hover:text-primary transition-colors"
        >
          Reset di sini
        </Link>
      </p>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hairline" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-canvas px-4 text-muted">atau</span>
        </div>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link
          href="/signup"
          className="text-ink font-medium underline underline-offset-2 hover:text-primary transition-colors"
        >
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
