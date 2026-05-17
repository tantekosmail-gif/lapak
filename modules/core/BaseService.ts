import { BaseResponse } from "./BaseResponse";
import type { BaseRepository } from "./BaseRepository";

export abstract class BaseService<
  TRepository extends BaseRepository<unknown, unknown, unknown, unknown, unknown>,
> extends BaseResponse {
  constructor(protected readonly repository: TRepository) {
    super();
  }
}
