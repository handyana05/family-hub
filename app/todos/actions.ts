"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

function normalizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function revalidateTodoViews() {
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  revalidatePath("/wall");
}

const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  dueAt: z.string().nullable(),
});

export async function createTodoAction(formData: FormData) {
  try {
    const session = await requireUser();

    const parsed = createTodoSchema.safeParse({
      title: formData.get("title"),
      dueAt: normalizeOptionalString(formData.get("dueAt")),
    });

    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid todo input.");
    }

    const dueAt =
      parsed.data.dueAt && parsed.data.dueAt.length > 0
        ? new Date(parsed.data.dueAt)
        : null;

    if (dueAt && Number.isNaN(dueAt.getTime())) {
      throw new Error("Invalid due date.");
    }

    await db.todoItem.create({
      data: {
        householdId: session.householdId,
        title: parsed.data.title,
        dueAt,
        status: "OPEN",
        priority: "MEDIUM",
        createdById: session.userId,
      },
    });

    revalidateTodoViews();
  } catch (error) {
    console.error("createTodoAction failed:", error);
    throw error;
  }
}

/**
 * Backward-compatible alias in case any older page still imports addTodoAction.
 */
export async function addTodoAction(formData: FormData) {
  return createTodoAction(formData);
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