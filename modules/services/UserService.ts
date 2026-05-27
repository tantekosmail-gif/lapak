import { BaseService, Response } from "@/modules/core";
import {
  UserRepository,
  userRepository,
} from "@/modules/repositories/UserRepository";
import type { UserEntity } from "@/modules/entities/User";
import {
  upsertGoogleUserSchema,
  type UpsertGoogleUserDto,
} from "@/modules/dto/User.dto";

export class UserService extends BaseService<UserRepository> {
  constructor(repository: UserRepository = userRepository) {
    super(repository);
  }

  async findByEmail(email: string): Promise<Response<UserEntity | null>> {
    try {
      const user = await this.repository.findByEmail(email);
      return this.ok(user);
    } catch (error) {
      return this.wrapError(error, "USER_FIND_FAILED");
    }
  }

  async findAdminByEmail(email: string): Promise<Response<UserEntity | null>> {
    try {
      const user = await this.repository.findAdminByEmail(email);
      return this.ok(user);
    } catch (error) {
      return this.wrapError(error, "USER_FIND_FAILED");
    }
  }

  async upsertFromGoogle(
    input: UpsertGoogleUserDto,
  ): Promise<Response<UserEntity>> {
    const parsed = upsertGoogleUserSchema.safeParse(input);
    if (!parsed.success) {
      return this.fail("USER_VALIDATION_FAILED", "Invalid Google profile", parsed.error.issues);
    }
    const { email, name, image } = parsed.data;

    try {
      const user = await this.repository.upsert(
        { email },
        {
          email,
          name: name ?? email,
          image: image ?? undefined,
        },
        {
          name: name ?? undefined,
          image: image ?? undefined,
        },
      );
      return this.ok(user);
    } catch (error) {
      return this.wrapError(error, "USER_UPSERT_FAILED");
    }
  }
}

export const userService = new UserService();
