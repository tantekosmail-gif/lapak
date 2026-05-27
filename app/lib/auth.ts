import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { userService } from "@/modules/services/UserService";

export const ADMIN_INTENT_COOKIE = "lapak_admin_intent";

async function isAdminIntent(): Promise<boolean> {
  try {
    const store = await cookies();
    return store.get(ADMIN_INTENT_COOKIE)?.value === "1";
  } catch {
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      if (await isAdminIntent()) {
        const admin = await userService.findAdminByEmail(user.email);
        if (!admin.success || !admin.data) {
          return "/admin/signin?error=NotAdmin";
        }
        return true;
      }

      const result = await userService.upsertFromGoogle({
        email: user.email,
        name: user.name,
        image: user.image,
      });

      return result.success;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const result = await userService.findByEmail(user.email);
        if (result.success && result.data) {
          token.id = result.data.id;
          token.userType = result.data.userType;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "number") {
        session.user.id = token.id;
      }
      if (session.user && typeof token.userType === "string") {
        session.user.userType = token.userType;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
