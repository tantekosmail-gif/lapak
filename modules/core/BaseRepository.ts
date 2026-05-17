export interface PrismaDelegate<
  TEntity,
  TWhereUnique = unknown,
  TWhere = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> {
  findUnique(args: { where: TWhereUnique }): Promise<TEntity | null>;
  findFirst(args?: { where?: TWhere }): Promise<TEntity | null>;
  findMany(args?: {
    where?: TWhere;
    skip?: number;
    take?: number;
    orderBy?: unknown;
  }): Promise<TEntity[]>;
  create(args: { data: TCreate }): Promise<TEntity>;
  update(args: { where: TWhereUnique; data: TUpdate }): Promise<TEntity>;
  upsert(args: {
    where: TWhereUnique;
    create: TCreate;
    update: TUpdate;
  }): Promise<TEntity>;
  delete(args: { where: TWhereUnique }): Promise<TEntity>;
  count(args?: { where?: TWhere }): Promise<number>;
}

export abstract class BaseRepository<
  TEntity,
  TWhereUnique = unknown,
  TWhere = unknown,
  TCreate = unknown,
  TUpdate = unknown,
> {
  constructor(
    protected readonly delegate: PrismaDelegate<
      TEntity,
      TWhereUnique,
      TWhere,
      TCreate,
      TUpdate
    >,
  ) {}

  findUnique(where: TWhereUnique): Promise<TEntity | null> {
    return this.delegate.findUnique({ where });
  }

  findFirst(where?: TWhere): Promise<TEntity | null> {
    return this.delegate.findFirst({ where });
  }

  findMany(args?: {
    where?: TWhere;
    skip?: number;
    take?: number;
    orderBy?: unknown;
  }): Promise<TEntity[]> {
    return this.delegate.findMany(args);
  }

  create(data: TCreate): Promise<TEntity> {
    return this.delegate.create({ data });
  }

  update(where: TWhereUnique, data: TUpdate): Promise<TEntity> {
    return this.delegate.update({ where, data });
  }

  upsert(
    where: TWhereUnique,
    create: TCreate,
    update: TUpdate,
  ): Promise<TEntity> {
    return this.delegate.upsert({ where, create, update });
  }

  delete(where: TWhereUnique): Promise<TEntity> {
    return this.delegate.delete({ where });
  }

  count(where?: TWhere): Promise<number> {
    return this.delegate.count({ where });
  }
}
