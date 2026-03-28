"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const addTodoSchema = z.object({
  title: z.string().trim().min(1).max(140),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueAt: z.string().optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  assignedToId: z.string().trim().optional().or(z.literal("")),
});

function revalidateTodoViews() {
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  revalidatePath("/wall");
}

export async function addTodoAction(formData: FormData) {
  const session = await requireUser();

  const parsed = addTodoSchema.safeParse({
    title: formData.get("title"),
    notes: formData.get("notes"),
    priority: formData.get("priority"),
    dueAt: formData.get("dueAt"),
    categoryId: formData.get("categoryId"),
    assignedToId: formData.get("assignedToId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid todo input");
  }

  await db.todoItem.create({
    data: {
      householdId: session.householdId,
      createdById: session.userId,
      title: parsed.data.title,
      notes: parsed.data.notes || null,
      priority: parsed.data.priority,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      categoryId: parsed.data.categoryId || null,
      assignedToId: parsed.data.assignedToId || null,
      status: "OPEN",
    },
  });

  revalidateTodoViews();
}

export async function completeTodoAction(formData: FormData) {
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

  revalidateTodoViews();
}

export async function reopenTodoAction(formData: FormData) {
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

  revalidateTodoViews();
}

export async function deleteTodoAction(formData: FormData) {
  const session = await requireUser();
  const todoId = z.string().min(1).parse(formData.get("todoId"));

  await db.todoItem.deleteMany({
    where: {
      id: todoId,
      householdId: session.householdId,
    },
  });

  revalidateTodoViews();
}
