import type { Order, OrderItem, OrderStatus } from "@/app/generated/prisma/client";

export type OrderEntity = Order;
export type OrderItemEntity = OrderItem;
export type OrderWithItems = Order & { items: OrderItem[] };
export type { OrderStatus };
