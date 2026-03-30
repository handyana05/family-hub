import "server-only";

import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { db } from "@/lib/db";

export type CalendarEventDto = {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  assignedToId: string | null;
  assignedToName: string | null;
};

type CalendarDayBucket = {
  date: Date;
  key: string;
  events: CalendarEventDto[];
};

function mapEvent(event: {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  categoryId: string | null;
  category?: { name: string; color: string | null } | null;
  assignedToId: string | null;
  assignedTo?: { name: string } | null;
}): CalendarEventDto {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: event.allDay,
    categoryId: event.categoryId,
    categoryName: event.category?.name ?? null,
    categoryColor: event.category?.color ?? null,
    assignedToId: event.assignedToId,
    assignedToName: event.assignedTo?.name ?? null,
  };
}

async function listEventsForRange(householdId: string, start: Date, end: Date) {
  const events = await db.calendarEvent.findMany({
    where: {
      householdId,
      startAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: [{ allDay: "desc" }, { startAt: "asc" }],
    include: {
      category: true,
      assignedTo: {
        select: { name: true },
      },
    },
  });

  return events.map(mapEvent);
}

function bucketEventsByDay(days: Date[], events: CalendarEventDto[]): CalendarDayBucket[] {
  const buckets = new Map<string, CalendarDayBucket>();

  for (const day of days) {
    const key = format(day, "yyyy-MM-dd");
    buckets.set(key, {
      date: day,
      key,
      events: [],
    });
  }

  for (const event of events) {
    const key = format(event.startAt, "yyyy-MM-dd");
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.events.push(event);
    }
  }

  return days.map((day) => buckets.get(format(day, "yyyy-MM-dd"))!);
}

export async function getCalendarDayData(householdId: string, date: Date) {
  const start = startOfDay(date);
  const end = endOfDay(date);
  const events = await listEventsForRange(householdId, start, end);

  return {
    view: "day" as const,
    date,
    events,
  };
}

export async function getCalendarWeekData(householdId: string, date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });
  const events = await listEventsForRange(householdId, start, end);
  const buckets = bucketEventsByDay(days, events);

  return {
    view: "week" as const,
    date,
    start,
    end,
    days: buckets,
  };
}

export async function getCalendarMonthData(householdId: string, date: Date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const events = await listEventsForRange(householdId, gridStart, gridEnd);
  const buckets = bucketEventsByDay(days, events);

  const weeks: Array<{
    days: Array<CalendarDayBucket & { inCurrentMonth: boolean }>;
  }> = [];

  for (let i = 0; i < buckets.length; i += 7) {
    const weekSlice = buckets.slice(i, i + 7).map((bucket) => ({
      ...bucket,
      inCurrentMonth: isSameMonth(bucket.date, date),
    }));

    weeks.push({ days: weekSlice });
  }

  return {
    view: "month" as const,
    date,
    monthStart,
    monthEnd,
    weeks,
  };
}