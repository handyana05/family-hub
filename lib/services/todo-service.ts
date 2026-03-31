import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

const todoItemWithRelations = Prisma.validator<Prisma.TodoItemDefaultArgs>()({
  include: {
    assignedTo: true,
    category: true,
  },
});

export type TodoItemDto = Prisma.TodoItemGetPayload<
  typeof todoItemWithRelations
>;

export async function listOpenTodos(householdId: string): Promise<TodoItemDto[]> {
  return db.todoItem.findMany({
    where: {
      householdId,
      status: "OPEN",
    },
    include: {
      assignedTo: true,
      category: true,
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });
}

export async function listDoneTodos(householdId: string): Promise<TodoItemDto[]> {
  return db.todoItem.findMany({
    where: {
      householdId,
      status: "DONE",
    },
    include: {
      assignedTo: true,
      category: true,
    },
    orderBy: {
      completedAt: "desc",
    },
    take: 30,
  });
}

export async function listOverdueTodos(
  householdId: string
): Promise<TodoItemDto[]> {
  return db.todoItem.findMany({
    where: {
      householdId,
      status: "OPEN",
      dueAt: {
        lt: new Date(),
      },
    },
    include: {
      assignedTo: true,
      category: true,
    },
    orderBy: {
      dueAt: "asc",
    },
  });
}