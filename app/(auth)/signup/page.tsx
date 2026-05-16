"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi kata sandi minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    setServerError("");
    setIsLoading(true);

    try {
      signupSchema.parse(data);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Terjadi kesalahan");
        return;
      }

      router.push("/signin?registered=true");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setServerError(error.issues[0].message);
      } else {
        setServerError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ink mb-1">Daftar</h2>
      <p className="text-muted text-sm mb-8">
        Buat akun baru dan mulai jualan online.
      </p>

      {serverError && (
        <div className="bg-red-50 border border-error/20 rounded-lg px-4 py-3 mb-6">
          <p className="text-error text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            Nama
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nama lengkap"
            {...register("name", {
              required: "Nama wajib diisi",
              minLength: {
                value: 2,
                message: "Nama minimal 2 karakter",
              },
            })}
            className="w-full h-14 px-3.5 rounded-lg border border-hairline bg-canvas text-ink text-base placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
          />
          {errors.name && (
            <p className="text-error text-xs mt-1.5">{errors.name.message}</p>
          )}
        </div>

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
              placeholder="Minimal 6 karakter"
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi kata sandi"
              {...register("confirmPassword", {
                required: "Konfirmasi kata sandi wajib diisi",
                minLength: {
                  value: 6,
                  message: "Konfirmasi kata sandi minimal 6 karakter",
                },
              })}
              className="w-full h-14 px-3.5 pr-12 rounded-lg border border-hairline bg-canvas text-ink text-base placeholder:text-muted-soft focus:outline-none focus:border-ink focus:border-2 focus:ring-0 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-error text-xs mt-1.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-medium text-base transition-colors hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Memproses..." : "Daftar"}
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

      {/* Footer link */}
      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link
          href="/signin"
          className="text-ink font-medium underline underline-offset-2 hover:text-primary transition-colors"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}