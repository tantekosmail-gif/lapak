import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType?: "ADMIN" | "CUSTOMER";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    userType?: "ADMIN" | "CUSTOMER";
  }
}
