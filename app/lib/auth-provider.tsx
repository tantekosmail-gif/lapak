"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Pembungkus client-side untuk NextAuth session — diperlukan agar `useSession`
 * dapat dipakai di komponen klien (Header, halaman storefront).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
