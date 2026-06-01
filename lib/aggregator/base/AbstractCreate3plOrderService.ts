import type { Response } from "@/modules/core";
import { BaseService } from "./BaseService";
import type { Create3plOrderInput, Create3plOrderResult } from "./types";

/**
 * Service abstract untuk pembuatan order/booking di 3PL.
 *
 * Tiap provider mengimplementasikan {@link createOrder} dengan menerjemahkan
 * {@link Create3plOrderInput} ke payload order-nya lalu memetakan respons ke
 * {@link Create3plOrderResult}.
 */
export abstract class AbstractCreate3plOrderService<
  TCredentials = Record<string, unknown>,
> extends BaseService<TCredentials> {
  abstract createOrder(
    input: Create3plOrderInput,
  ): Promise<Response<Create3plOrderResult>>;
}
