import orderService from "@/modules/services/OrderService";
import { requireAdmin } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// PATCH /api/orders/:id/send -> admin menandai pesanan dikirim (DIPROSES -> DIKIRIM).
export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return jsonError("FORBIDDEN", "Admin access required", 403);
  }

  const { id } = await context.params;
  return respond(await orderService.send(Number(id)));
}
