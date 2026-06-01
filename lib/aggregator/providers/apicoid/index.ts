import type { AggregatorProvider } from "../../base";
import { ApiCoIdLocationService } from "./ApiCoIdLocationService";
import { ApiCoIdOrderService } from "./ApiCoIdOrderService";
import { ApiCoIdRateService } from "./ApiCoIdRateService";

/** Deskriptor provider API.co.id (RajaOngkir x Komship). */
export const apiCoIdProvider: AggregatorProvider = {
  code: "apicoid",
  label: "API.co.id",
  createRateService: (config) => new ApiCoIdRateService(config),
  createOrderService: (config) => new ApiCoIdOrderService(config),
  createLocationService: (config) => new ApiCoIdLocationService(config),
};

export { ApiCoIdRateService } from "./ApiCoIdRateService";
export { ApiCoIdOrderService } from "./ApiCoIdOrderService";
export { ApiCoIdLocationService } from "./ApiCoIdLocationService";
export {
  ApiCoIdClient,
  ApiCoIdError,
  apiCoIdCredentialsSchema,
  type ApiCoIdCredentials,
} from "./ApiCoIdClient";
