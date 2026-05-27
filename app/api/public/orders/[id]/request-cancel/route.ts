import orderService from "@/modules/services/OrderService";
import { currentUser } from "@/app/lib/authz";
import { jsonError, respond } from "@/app/lib/api";
import { NextRequest } from "next/server";

// PUT /api/public/orders/:id/request-cancel -> customer meminta pembatalan order miliknya.
export async function PUT(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) {
    return jsonError("UNAUTHORIZED", "Authentication required", 401);
  }

  const { id } = await context.params;
  return respond(await orderService.requestCancel(Number(id), user.id));
}
