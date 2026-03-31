import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const shoppingItemWithCategory = Prisma.validator<Prisma.ShoppingItemDefaultArgs>()({
  include: {
    category: true,
  },
});

export type ShoppingItemDto = Prisma.ShoppingItemGetPayload<
  typeof shoppingItemWithCategory
>;

export async function listActiveItems(householdId: string): Promise<ShoppingItemDto[]> {
  return db.shoppingItem.findMany({
    where: {
      householdId,
      status: "ACTIVE",
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function listCompletedItems(
  householdId: string
): Promise<ShoppingItemDto[]> {
  return db.shoppingItem.findMany({
    where: {
      householdId,
      status: "DONE",
    },
    include: {
      category: true,
    },
    orderBy: {
      completedAt: "desc",
    },
    take: 30,
  });
}