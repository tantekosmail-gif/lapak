import type { Response } from "@/modules/core";
import {
  AbstractLocationService,
  type LocationArea,
  type LocationSearchInput,
} from "../../base";
import { ApiCoIdClient } from "./ApiCoIdClient";

/** Bentuk satu item destination dari RajaOngkir. */
interface ApiCoIdDestination {
  id: number;
  label: string;
  subdistrict_name?: string;
  district_name?: string;
  city_name?: string;
  province_name?: string;
  zip_code?: string;
}

/**
 * Pencarian area tujuan via RajaOngkir:
 * `GET /destination/domestic-destination?search=&limit=&offset=`.
 */
export class ApiCoIdLocationService extends AbstractLocationService {
  readonly code = "apicoid";
  readonly label = "API.co.id";

  async searchDestination(
    input: LocationSearchInput,
  ): Promise<Response<LocationArea[]>> {
    try {
      const client = ApiCoIdClient.fromConfig(this.config);
      const data = await client.costGet<ApiCoIdDestination[]>(
        "/destination/domestic-destination",
        { search: input.query, limit: input.limit, offset: input.offset },
      );
      return this.ok(data.map((d) => this.toArea(d)));
    } catch (error) {
      return this.wrapError(error, "APICOID_LOCATION_FAILED");
    }
  }

  private toArea(destinetion: ApiCoIdDestination): LocationArea {
    return {
      id: String(destinetion.id),
      label: destinetion.label,
      subdistrictName: destinetion.subdistrict_name,
      districtName: destinetion.district_name,
      cityName: destinetion.city_name,
      provinceName: destinetion.province_name,
      postalCode: destinetion.zip_code,
      raw: destinetion,
    };
  }
}
