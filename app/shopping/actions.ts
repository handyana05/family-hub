"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const addShoppingItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  quantity: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
});

function revalidateShoppingViews() {
  revalidatePath("/shopping");
  revalidatePath("/dashboard");
  revalidatePath("/wall");
}

export async function addShoppingItemAction(formData: FormData) {
  const session = await requireUser();

  const parsed = addShoppingItemSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid shopping item input");
  }

  await db.shoppingItem.create({
    data: {
      householdId: session.householdId,
      addedById: session.userId,
      name: parsed.data.name,
      quantity: parsed.data.quantity || null,
      notes: parsed.data.notes || null,
      categoryId: parsed.data.categoryId || null,
      status: "ACTIVE",
    },
  });

  revalidateShoppingViews();
}

export async function completeShoppingItemAction(formData: FormData) {
  const session = await requireUser();
  const itemId = z.string().min(1).parse(formData.get("itemId"));

  await db.shoppingItem.updateMany({
    where: {
      id: itemId,
      householdId: session.householdId,
      status: "ACTIVE",
    },
    data: {
      status: "DONE",
      completedAt: new Date(),
    },
  });

  revalidateShoppingViews();
}

export async function reopenShoppingItemAction(formData: FormData) {
  const session = await requireUser();
  const itemId = z.string().min(1).parse(formData.get("itemId"));

  await db.shoppingItem.updateMany({
    where: {
      id: itemId,
      householdId: session.householdId,
      status: "DONE",
    },
    data: {
      status: "ACTIVE",
      completedAt: null,
    },
  });

  revalidateShoppingViews();
}

export async function deleteShoppingItemAction(formData: FormData) {
  const session = await requireUser();
  const itemId = z.string().min(1).parse(formData.get("itemId"));

  await db.shoppingItem.deleteMany({
    where: {
      id: itemId,
      householdId: session.householdId,
    },
  });

  revalidateShoppingViews();
}
