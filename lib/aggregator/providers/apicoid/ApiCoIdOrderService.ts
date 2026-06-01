import type { Response } from "@/modules/core";
import {
  AbstractCreate3plOrderService,
  type Create3plOrderInput,
  type Create3plOrderResult,
} from "../../base";
import { ApiCoIdClient } from "./ApiCoIdClient";

/** Bentuk data hasil store order Komship. */
interface ApiCoIdStoreOrderResult {
  order_id: number;
  order_no: string;
}

/**
 * Pembuatan order via Komship:
 * `POST /order/api/v1/orders/store` (JSON).
 */
export class ApiCoIdOrderService extends AbstractCreate3plOrderService {
  readonly code = "apicoid";
  readonly label = "API.co.id";

  async createOrder(
    input: Create3plOrderInput,
  ): Promise<Response<Create3plOrderResult>> {
    try {
      const client = ApiCoIdClient.fromConfig(this.config);
      const data = await client.orderPostJson<ApiCoIdStoreOrderResult>(
        "/order/api/v1/orders/store",
        this.toStoreOrderBody(input),
      );
      return this.ok({
        aggregator: this.code,
        orderId: String(data.order_id),
        orderNo: data.order_no,
        raw: data,
      });
    } catch (error) {
      return this.wrapError(error, "APICOID_ORDER_FAILED");
    }
  }

  private toStoreOrderBody(input: Create3plOrderInput) {
    return {
      order_date: input.orderDate ?? new Date().toISOString().slice(0, 10),
      brand_name: input.brandName,
      shipper_name: input.shipper.name,
      shipper_phone: input.shipper.phone,
      shipper_destination_id: Number(input.shipper.areaId),
      shipper_address: input.shipper.address,
      shipper_email: input.shipper.email,
      origin_pin_point: input.shipper.pinPoint,
      receiver_name: input.receiver.name,
      receiver_phone: input.receiver.phone,
      receiver_destination_id: Number(input.receiver.areaId),
      receiver_address: input.receiver.address,
      destination_pin_point: input.receiver.pinPoint,
      shipping: input.courierCode.toUpperCase(),
      shipping_type: input.serviceCode,
      shipping_cost: input.shippingCostIdr,
      shipping_cashback: input.shippingCashbackIdr ?? 0,
      service_fee: input.serviceFeeIdr ?? 0,
      additional_cost: input.additionalCostIdr ?? 0,
      grand_total: input.grandTotalIdr,
      payment_method: input.paymentMethod,
      cod_value: input.codValueIdr ?? 0,
      insurance_value: input.insuranceValueIdr ?? 0,
      order_details: input.items.map((item) => ({
        product_name: item.name,
        product_variant_name: item.variantName,
        product_price: item.priceIdr,
        product_weight: item.weightGram,
        product_width: item.widthCm,
        product_height: item.heightCm,
        product_length: item.lengthCm,
        qty: item.qty,
        subtotal: item.subtotalIdr,
      })),
    };
  }
}
