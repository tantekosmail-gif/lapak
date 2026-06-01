import type { Response } from "@/modules/core";
import {
  AbstractRateService,
  type RateQuote,
  type RateRequest,
} from "../../base";
import { ApiCoIdClient } from "./ApiCoIdClient";

/** Kurir default bila pemanggil tidak memfilter. */
const DEFAULT_COURIERS = [
  "jne",
  "jnt",
  "sicepat",
  "anteraja",
  "pos",
  "tiki",
];

/** Bentuk satu item tarif dari RajaOngkir. */
interface ApiCoIdRate {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd?: string;
}

/**
 * Cek tarif via RajaOngkir:
 * `POST /calculate/domestic-cost` (form-urlencoded).
 */
export class ApiCoIdRateService extends AbstractRateService {
  readonly code = "apicoid";
  readonly label = "API.co.id";

  async getRates(input: RateRequest): Promise<Response<RateQuote[]>> {
    try {
      const client = ApiCoIdClient.fromConfig(this.config);
      const couriers = input.couriers?.length
        ? input.couriers
        : DEFAULT_COURIERS;
      const data = await client.costPostForm<ApiCoIdRate[]>(
        "/calculate/domestic-cost",
        {
          origin: input.originAreaId,
          destination: input.destinationAreaId,
          weight: input.weightGram,
          // RajaOngkir menerima beberapa kurir dipisah ":".
          courier: couriers.join(":"),
        },
      );
      return this.ok(data.map((r) => this.toQuote(r)));
    } catch (error) {
      return this.wrapError(error, "APICOID_RATE_FAILED");
    }
  }

  private toQuote(r: ApiCoIdRate): RateQuote {
    return {
      aggregator: this.code,
      courierCode: r.code,
      courierName: r.name,
      serviceCode: r.service,
      serviceName: r.description,
      priceIdr: r.cost,
      etd: r.etd,
      raw: r,
    };
  }
}
