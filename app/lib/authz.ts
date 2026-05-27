import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export type SessionUser = {
  id: number;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  userType?: "ADMIN" | "CUSTOMER";
};

/** Pengguna yang sedang login, atau null kalau anonim. */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/** Pengguna yang login dengan role ADMIN, atau null kalau bukan admin/anonim. */
export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await currentUser();
  if (!user || user.userType !== "ADMIN") return null;
  return user;
}
