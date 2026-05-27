import orderService from "@/modules/services/OrderService";
import { requireAdmin } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// POST /api/orders -> admin membuat order atas nama customer.
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return jsonError("FORBIDDEN", "Admin access required", 403);
  }

  const body = await request.json();
  return respond(await orderService.createAsAdmin(body), 201);
}
