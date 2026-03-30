"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type EventFormState = {
  ok: boolean;
  message?: string;
};

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(140, "Title is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().optional().or(z.literal("")),
  endTime: z.string().optional().or(z.literal("")),
  allDay: z.union([z.literal("on"), z.literal("")]).optional(),
  categoryId: z.string().trim().optional().or(z.literal("")),
  assignedToId: z.string().trim().optional().or(z.literal("")),
});

function revalidateCalendarViews() {
  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  revalidatePath("/wall");
}

function buildDateTime(dateStr: string, timeStr?: string | null) {
  if (!timeStr) {
    return new Date(`${dateStr}T00:00:00`);
  }
  return new Date(`${dateStr}T${timeStr}:00`);
}

function getReturnTo(formData: FormData) {
  const parsed = z.string().min(1).safeParse(formData.get("returnTo"));
  return parsed.success ? parsed.data : "/calendar";
}

export async function createEventAction(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const session = await requireUser();

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    allDay: formData.get("allDay"),
    categoryId: formData.get("categoryId"),
    assignedToId: formData.get("assignedToId"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid event input",
    };
  }

  try {
    const isAllDay = parsed.data.allDay === "on";

    const startAt = isAllDay
      ? new Date(`${parsed.data.date}T00:00:00`)
      : buildDateTime(parsed.data.date, parsed.data.startTime);

    const endAt =
      isAllDay || !parsed.data.endTime
        ? null
        : buildDateTime(parsed.data.date, parsed.data.endTime);

    await db.calendarEvent.create({
      data: {
        householdId: session.householdId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        startAt,
        endAt,
        allDay: isAllDay,
        categoryId: parsed.data.categoryId || null,
        assignedToId: parsed.data.assignedToId || null,
        createdById: session.userId,
      },
    });

    revalidateCalendarViews();

    return {
      ok: true,
      message: "Event created.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not create event.",
    };
  }
}

export async function updateEventAction(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const session = await requireUser();

  const eventId = z.string().min(1).safeParse(formData.get("eventId"));
  if (!eventId.success) {
    return { ok: false, message: "Missing event id." };
  }

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    allDay: formData.get("allDay"),
    categoryId: formData.get("categoryId"),
    assignedToId: formData.get("assignedToId"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid event input",
    };
  }

  const returnTo = getReturnTo(formData);

  try {
    const isAllDay = parsed.data.allDay === "on";

    const startAt = isAllDay
      ? new Date(`${parsed.data.date}T00:00:00`)
      : buildDateTime(parsed.data.date, parsed.data.startTime);

    const endAt =
      isAllDay || !parsed.data.endTime
        ? null
        : buildDateTime(parsed.data.date, parsed.data.endTime);

    await db.calendarEvent.updateMany({
      where: {
        id: eventId.data,
        householdId: session.householdId,
      },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        startAt,
        endAt,
        allDay: isAllDay,
        categoryId: parsed.data.categoryId || null,
        assignedToId: parsed.data.assignedToId || null,
      },
    });

    revalidateCalendarViews();
  } catch {
    return {
      ok: false,
      message: "Could not update event.",
    };
  }

  redirect(returnTo);
}

export async function deleteEventAction(formData: FormData) {
  const session = await requireUser();
  const eventId = z.string().min(1).parse(formData.get("eventId"));
  const returnTo = getReturnTo(formData);

  await db.calendarEvent.deleteMany({
    where: {
      id: eventId,
      householdId: session.householdId,
    },
  });

  revalidateCalendarViews();
  redirect(returnTo);
}