import "server-only";

import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { db } from "@/lib/db";

export type WallEventDto = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  categoryName: string | null;
  categoryColor: string | null;
  assignedToName: string | null;
};

export type WallTodoDto = {
  id: string;
  title: string;
  dueAt: Date | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "DONE";
  assignedToName: string | null;
  completedAt: Date | null;
};

export type WallShoppingItemDto = {
  id: string;
  name: string;
  quantity: string | null;
  categoryName: string | null;
};

export type WallNoteDto = {
  id: string;
  title: string;
  content: string;
};

function mapEvent(event: {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  category?: { name: string; color: string | null } | null;
  assignedTo?: { name: string } | null;
}): WallEventDto {
  return {
    id: event.id,
    title: event.title,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: event.allDay,
    categoryName: event.category?.name ?? null,
    categoryColor: event.category?.color ?? null,
    assignedToName: event.assignedTo?.name ?? null,
  };
}

function mapTodo(todo: {
  id: string;
  title: string;
  dueAt: Date | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "DONE";
  completedAt: Date | null;
  assignedTo?: { name: string } | null;
}): WallTodoDto {
  return {
    id: todo.id,
    title: todo.title,
    dueAt: todo.dueAt,
    priority: todo.priority,
    status: todo.status,
    completedAt: todo.completedAt,
    assignedToName: todo.assignedTo?.name ?? null,
  };
}

async function getSharedWallData(householdId: string) {
  const now = new Date();

  const [shoppingItems, pinnedNote] = await Promise.all([
    db.shoppingItem.findMany({
      where: {
        householdId,
        status: "ACTIVE",
      },
      orderBy: [{ createdAt: "desc" }],
      take: 8,
      include: {
        category: true,
      },
    }),
    db.familyNote.findFirst({
      where: {
        householdId,
        pinned: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  return {
    now,
    shoppingItems: shoppingItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      categoryName: item.category?.name ?? null,
    })),
    pinnedNote: pinnedNote
      ? {
          id: pinnedNote.id,
          title: pinnedNote.title,
          content: pinnedNote.content,
        }
      : null,
  };
}

export async function getWallDayViewData(householdId: string, date: Date) {
  const shared = await getSharedWallData(householdId);

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const recentPastStart = startOfDay(subDays(date, 3));

  const [todayEvents, recentPastEvents, openTodos, completedTodos] = await Promise.all([
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      orderBy: [{ allDay: "desc" }, { startAt: "asc" }],
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: recentPastStart,
          lt: dayStart,
        },
      },
      orderBy: [{ startAt: "desc" }],
      take: 6,
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 8,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "DONE",
        completedAt: {
          gte: recentPastStart,
          lte: dayEnd,
        },
      },
      orderBy: [{ completedAt: "desc" }],
      take: 6,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  return {
    view: "day" as const,
    date,
    ...shared,
    todayEvents: todayEvents.map(mapEvent),
    recentPastEvents: recentPastEvents.map(mapEvent),
    openTodos: openTodos.map(mapTodo),
    completedTodos: completedTodos.map(mapTodo),
  };
}

export async function getWallWeekViewData(householdId: string, date: Date) {
  const shared = await getSharedWallData(householdId);

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const recentPastStart = startOfDay(subDays(weekStart, 3));

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const [weekEventsRaw, recentPastEvents, openTodos, completedTodos] = await Promise.all([
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: [{ startAt: "asc" }],
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: recentPastStart,
          lt: weekStart,
        },
      },
      orderBy: [{ startAt: "desc" }],
      take: 6,
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 10,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "DONE",
        completedAt: {
          gte: recentPastStart,
          lte: weekEnd,
        },
      },
      orderBy: [{ completedAt: "desc" }],
      take: 8,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  const weekEvents = weekEventsRaw.map(mapEvent);
  const dayBuckets = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    return {
      date: day,
      key,
      events: weekEvents.filter((event) => format(event.startAt, "yyyy-MM-dd") === key),
    };
  });

  return {
    view: "week" as const,
    date,
    start: weekStart,
    end: weekEnd,
    ...shared,
    days: dayBuckets,
    recentPastEvents: recentPastEvents.map(mapEvent),
    openTodos: openTodos.map(mapTodo),
    completedTodos: completedTodos.map(mapTodo),
  };
}

export async function getWallMonthViewData(
  householdId: string,
  date: Date,
  selectedDate?: Date
) {
  const shared = await getSharedWallData(householdId);

  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const recentPastStart = startOfDay(subDays(monthStart, 3));

  const chosenDate = selectedDate ?? date;
  const selectedDayStart = startOfDay(chosenDate);
  const selectedDayEnd = endOfDay(chosenDate);

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const [
    monthEventsRaw,
    monthDueTodosRaw,
    recentPastEvents,
    openTodos,
    completedTodos,
    selectedDayEventsRaw,
    selectedDayOpenTodosRaw,
    selectedDayCompletedTodosRaw,
  ] = await Promise.all([
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: gridStart,
          lte: gridEnd,
        },
      },
      orderBy: [{ startAt: "asc" }],
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
        dueAt: {
          gte: gridStart,
          lte: gridEnd,
        },
      },
      select: {
        id: true,
        dueAt: true,
      },
    }),
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: recentPastStart,
          lt: monthStart,
        },
      },
      orderBy: [{ startAt: "desc" }],
      take: 6,
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 8,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "DONE",
        completedAt: {
          gte: recentPastStart,
          lte: endOfDay(addDays(monthEnd, 1)),
        },
      },
      orderBy: [{ completedAt: "desc" }],
      take: 8,
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    db.calendarEvent.findMany({
      where: {
        householdId,
        startAt: {
          gte: selectedDayStart,
          lte: selectedDayEnd,
        },
      },
      orderBy: [{ allDay: "desc" }, { startAt: "asc" }],
      include: {
        category: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "OPEN",
        dueAt: {
          gte: selectedDayStart,
          lte: selectedDayEnd,
        },
      },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
    db.todoItem.findMany({
      where: {
        householdId,
        status: "DONE",
        completedAt: {
          gte: selectedDayStart,
          lte: selectedDayEnd,
        },
      },
      orderBy: [{ completedAt: "desc" }],
      include: {
        assignedTo: { select: { name: true } },
      },
    }),
  ]);

  const monthEvents = monthEventsRaw.map(mapEvent);

  const buckets = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");

    const eventsForDay = monthEvents.filter(
      (event) => format(event.startAt, "yyyy-MM-dd") === key
    );

    const dueTodoCount = monthDueTodosRaw.filter(
      (todo) => todo.dueAt && format(todo.dueAt, "yyyy-MM-dd") === key
    ).length;

    return {
      date: day,
      key,
      inCurrentMonth: isSameMonth(day, date),
      isSelected: key === format(chosenDate, "yyyy-MM-dd"),
      events: eventsForDay,
      eventCount: eventsForDay.length,
      dueTodoCount,
    };
  });

  const weeks: Array<{
    days: typeof buckets;
  }> = [];

  for (let i = 0; i < buckets.length; i += 7) {
    weeks.push({
      days: buckets.slice(i, i + 7),
    });
  }

  return {
    view: "month" as const,
    date,
    selectedDate: chosenDate,
    monthStart,
    monthEnd,
    ...shared,
    weeks,
    recentPastEvents: recentPastEvents.map(mapEvent),
    openTodos: openTodos.map(mapTodo),
    completedTodos: completedTodos.map(mapTodo),
    selectedDayEvents: selectedDayEventsRaw.map(mapEvent),
    selectedDayOpenTodos: selectedDayOpenTodosRaw.map(mapTodo),
    selectedDayCompletedTodos: selectedDayCompletedTodosRaw.map(mapTodo),
  };
}