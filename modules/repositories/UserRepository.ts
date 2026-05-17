import { BaseRepository } from "@/modules/core";
import { prisma } from "@/app/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import type { UserEntity } from "@/modules/entities/User";

export class UserRepository extends BaseRepository<
  UserEntity,
  Prisma.UserWhereUniqueInput,
  Prisma.UserWhereInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user);
  }

  findByEmail(email: string) {
    return this.delegate.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.delegate.findUnique({ where: { id } });
  }
}

export const userRepository = new UserRepository();
