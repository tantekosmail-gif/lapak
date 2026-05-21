import { getOrders } from "@/app/actions/orders";
import OrderTable from "./orderTable";

export default async function DashboardPesananPage() {
  const orders = await getOrders();

  return <OrderTable orders={orders} />;
}
