"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

function revalidateWallRelatedViews() {
  revalidatePath("/wall");
  revalidatePath("/dashboard");
  revalidatePath("/todos");
  revalidatePath("/shopping");
}

export async function completeTodoFromWallAction(formData: FormData) {
  const session = await requireUser();
  const todoId = z.string().min(1).parse(formData.get("todoId"));

  await db.todoItem.updateMany({
    where: {
      id: todoId,
      householdId: session.householdId,
      status: "OPEN",
    },
    data: {
      status: "DONE",
      completedAt: new Date(),
    },
  });

  revalidateWallRelatedViews();
}

export async function reopenTodoFromWallAction(formData: FormData) {
  const session = await requireUser();
  const todoId = z.string().min(1).parse(formData.get("todoId"));

  await db.todoItem.updateMany({
    where: {
      id: todoId,
      householdId: session.householdId,
      status: "DONE",
    },
    data: {
      status: "OPEN",
      completedAt: null,
    },
  });

  revalidateWallRelatedViews();
}

export async function completeShoppingFromWallAction(formData: FormData) {
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

  revalidateWallRelatedViews();
}

export async function reopenShoppingFromWallAction(formData: FormData) {
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

  revalidateWallRelatedViews();
}