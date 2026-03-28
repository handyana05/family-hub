import "server-only";

import { addDays, endOfDay, startOfDay } from "date-fns";
import { db } from "@/lib/db";

export async function getDashboardData(householdId: string) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const upcomingEnd = addDays(todayEnd, 7);

  const [
    todaysEvents,
    upcomingEvents,
    openTodos,
    overdueTodos,
    activeShoppingItems,
    pinnedNote,
  ] = await Promise.all([
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: [{ allDay: "desc" }, { startAt: "asc" }],
      include: {
        category: true,
        assignedTo: true,
      },
    }),

    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gt: todayEnd,
          lte: upcomingEnd,
        },
      },
      orderBy: [{ startAt: "asc" }],
      take: 8,
      include: {
        category: true,
        assignedTo: true,
      },
    }),

    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 10,
      include: {
        category: true,
        assignedTo: true,
      },
    }),

    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
        dueAt: {
          lt: now,
        },
      },
      orderBy: [{ dueAt: "asc" }],
      take: 10,
      include: {
        category: true,
        assignedTo: true,
      },
    }),

    db.shoppingItem.findMany({
      where: {
        householdId,
        status: "ACTIVE",
      },
      orderBy: [{ createdAt: "desc" }],
      take: 12,
      include: {
        category: true,
      },
    }),

    db.familyNote.findFirst({
      where: {
        householdId,
        pinned: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  return {
    now,
    todaysEvents,
    upcomingEvents,
    openTodos,
    overdueTodos,
    activeShoppingItems,
    pinnedNote,
  };
}
