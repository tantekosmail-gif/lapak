type PrismaDelegateMock = {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  upsert: jest.Mock;
  delete: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
  aggregate: jest.Mock;
};

export type PrismaMock = {
  user: PrismaDelegateMock;
  productCategories: PrismaDelegateMock;
  product: PrismaDelegateMock;
  productImage: PrismaDelegateMock;
  order: PrismaDelegateMock;
  orderItem: PrismaDelegateMock;
  rating: PrismaDelegateMock;
  cart: PrismaDelegateMock;
  $transaction: jest.Mock;
  $connect: jest.Mock;
  $disconnect: jest.Mock;
};

const createDelegateMock = (): PrismaDelegateMock => ({
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
});

export const createPrismaMock = (): PrismaMock => ({
  user: createDelegateMock(),
  productCategories: createDelegateMock(),
  product: createDelegateMock(),
  productImage: createDelegateMock(),
  order: createDelegateMock(),
  orderItem: createDelegateMock(),
  rating: createDelegateMock(),
  cart: createDelegateMock(),
  $transaction: jest.fn((arg) =>
    Array.isArray(arg) ? Promise.all(arg) : Promise.resolve(arg),
  ),
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
});

export const prismaMock = createPrismaMock();

jest.mock("@/app/lib/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

export const resetPrismaMock = () => {
  for (const key of Object.keys(prismaMock) as (keyof PrismaMock)[]) {
    const value = prismaMock[key];
    if (typeof value === "function" && "mockReset" in value) {
      (value as jest.Mock).mockReset();
      continue;
    }
    for (const method of Object.keys(value as object) as (keyof PrismaDelegateMock)[]) {
      (value as PrismaDelegateMock)[method].mockReset();
    }
  }
};
