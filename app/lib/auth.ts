import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userService } from "@/modules/services/UserService";

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
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

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
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "number") {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
