import orderService from "@/modules/services/OrderService";
import { currentUser } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// POST /api/public/orders -> customer membuat order untuk dirinya sendiri.
export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return jsonError("UNAUTHORIZED", "Authentication required", 401);
  }

  const body = await request.json();
  return respond(await orderService.create(user.id, body), 201);
}
