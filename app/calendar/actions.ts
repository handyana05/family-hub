"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type EventFormState = {
  ok: boolean;
  message: string;
};

const initialState: EventFormState = {
  ok: false,
  message: "",
};

function normalizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function combineDateAndTime(dateStr: string, timeStr: string | null) {
  if (!timeStr) return null;

  const date = new Date(`${dateStr}T${timeStr}`);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function startOfDayLocal(dateStr: string) {
  const date = new Date(`${dateStr}T00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function endOfDayLocal(dateStr: string) {
  const date = new Date(`${dateStr}T23:59`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

const baseEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().nullable(),
  date: z.string().trim().min(1, "Date is required."),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  allDay: z.boolean(),
  categoryId: z.string().nullable(),
  assignedToId: z.string().nullable(),
});

function revalidateEventViews() {
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath("/wall");
}

export async function createEventAction(
  _prevState: EventFormState = initialState,
  formData: FormData
): Promise<EventFormState> {
  try {
    const session = await requireUser();

    const parsed = baseEventSchema.safeParse({
      title: formData.get("title"),
      description: normalizeOptionalString(formData.get("description")),
      date: formData.get("date"),
      startTime: normalizeOptionalString(formData.get("startTime")),
      endTime: normalizeOptionalString(formData.get("endTime")),
      allDay: formData.get("allDay") === "on",
      categoryId: normalizeOptionalString(formData.get("categoryId")),
      assignedToId: normalizeOptionalString(formData.get("assignedToId")),
    });

    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }

    const { title, description, date, startTime, endTime, allDay, categoryId, assignedToId } =
      parsed.data;

    let startAt: Date | null = null;
    let endAt: Date | null = null;

    if (allDay) {
      startAt = startOfDayLocal(date);
      endAt = endOfDayLocal(date);
    } else {
      startAt = combineDateAndTime(date, startTime);

      if (!startAt) {
        return {
          ok: false,
          message: "Start time is required for non all-day events.",
        };
      }

      endAt = combineDateAndTime(date, endTime);

      if (endAt && endAt < startAt) {
        return {
          ok: false,
          message: "End time cannot be earlier than start time.",
        };
      }
    }

    if (!startAt) {
      return {
        ok: false,
        message: "Invalid date or time input.",
      };
    }

    await db.calendarEvent.create({
      data: {
        householdId: session.householdId,
        title,
        description,
        startAt,
        endAt,
        allDay,
        categoryId,
        assignedToId,
        createdById: session.userId,
      },
    });

    revalidateEventViews();

    return {
      ok: true,
      message: "Event created.",
    };
  } catch (error) {
    console.error("createEventAction failed:", error);
    return {
      ok: false,
      message: "Could not create event.",
    };
  }
}

export async function updateEventAction(
  _prevState: EventFormState = initialState,
  formData: FormData
): Promise<EventFormState> {
  try {
    const session = await requireUser();

    const eventId = z.string().min(1).parse(formData.get("eventId"));

    const parsed = baseEventSchema.safeParse({
      title: formData.get("title"),
      description: normalizeOptionalString(formData.get("description")),
      date: formData.get("date"),
      startTime: normalizeOptionalString(formData.get("startTime")),
      endTime: normalizeOptionalString(formData.get("endTime")),
      allDay: formData.get("allDay") === "on",
      categoryId: normalizeOptionalString(formData.get("categoryId")),
      assignedToId: normalizeOptionalString(formData.get("assignedToId")),
    });

    if (!parsed.success) {
      return {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid input.",
      };
    }

    const { title, description, date, startTime, endTime, allDay, categoryId, assignedToId } =
      parsed.data;

    let startAt: Date | null = null;
    let endAt: Date | null = null;

    if (allDay) {
      startAt = startOfDayLocal(date);
      endAt = endOfDayLocal(date);
    } else {
      startAt = combineDateAndTime(date, startTime);

      if (!startAt) {
        return {
          ok: false,
          message: "Start time is required for non all-day events.",
        };
      }

      endAt = combineDateAndTime(date, endTime);

      if (endAt && endAt < startAt) {
        return {
          ok: false,
          message: "End time cannot be earlier than start time.",
        };
      }
    }

    if (!startAt) {
      return {
        ok: false,
        message: "Invalid date or time input.",
      };
    }

    const updated = await db.calendarEvent.updateMany({
      where: {
        id: eventId,
        householdId: session.householdId,
      },
      data: {
        title,
        description,
        startAt,
        endAt,
        allDay,
        categoryId,
        assignedToId,
      },
    });

    if (updated.count === 0) {
      return {
        ok: false,
        message: "Event not found.",
      };
    }

    revalidateEventViews();

    return {
      ok: true,
      message: "Event updated.",
    };
  } catch (error) {
    console.error("updateEventAction failed:", error);
    return {
      ok: false,
      message: "Could not update event.",
    };
  }
}

export async function deleteEventAction(formData: FormData) {
  const session = await requireUser();
  const eventId = z.string().min(1).parse(formData.get("eventId"));

  await db.calendarEvent.deleteMany({
    where: {
      id: eventId,
      householdId: session.householdId,
    },
  });

  revalidateEventViews();
}