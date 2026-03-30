"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarView, formatDateParam } from "@/lib/date";
import {
  createEventAction,
  updateEventAction,
  type EventFormState,
} from "../actions";
import { ActionButton } from "@/components/action-button";

type Option = {
  id: string;
  name: string;
};

type EditableEvent = {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  categoryId: string | null;
  assignedToId: string | null;
};

type EventFormClientProps = {
  defaultDate: string;
  categories: Option[];
  users: Option[];
  editingEvent?: EditableEvent | null;
  currentView: CalendarView;
  currentDate: Date;
};

const initialState: EventFormState = {
  ok: false,
  message: "",
};

export function EventFormClient({
  defaultDate,
  categories,
  users,
  editingEvent,
  currentView,
  currentDate,
}: EventFormClientProps) {
  const isEditing = Boolean(editingEvent);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    isEditing ? updateEventAction : createEventAction,
    initialState
  );

  const dateValue = editingEvent
    ? format(editingEvent.startAt, "yyyy-MM-dd")
    : defaultDate;

  const startTimeValue =
    editingEvent && !editingEvent.allDay
      ? format(editingEvent.startAt, "HH:mm")
      : "";

  const endTimeValue =
    editingEvent && editingEvent.endAt && !editingEvent.allDay
      ? format(editingEvent.endAt, "HH:mm")
      : "";

  const clearSelectionHref = `/calendar?view=${currentView}&date=${formatDateParam(currentDate)}`;
  const returnTo = clearSelectionHref;

  useEffect(() => {
    if (!isEditing && state.ok) {
      formRef.current?.reset();

      const dateInput = formRef.current?.elements.namedItem("date") as HTMLInputElement | null;
      if (dateInput) {
        dateInput.value = defaultDate;
      }
    }
  }, [state.ok, isEditing, defaultDate]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isEditing ? "Edit event" : "Add event"}
        </h2>

        {isEditing ? (
          <Link
            href={clearSelectionHref}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-100"
          >
            Clear selection
          </Link>
        ) : null}
      </div>

      <form ref={formRef} action={formAction} className="grid gap-3">
        {isEditing ? (
          <input type="hidden" name="eventId" value={editingEvent!.id} />
        ) : null}

        <input type="hidden" name="returnTo" value={returnTo} />

        <input
          name="title"
          placeholder="Event title"
          required
          defaultValue={editingEvent?.title ?? ""}
          className="rounded-lg border px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          rows={3}
          defaultValue={editingEvent?.description ?? ""}
          className="rounded-lg border px-3 py-2"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="date"
            type="date"
            defaultValue={dateValue}
            required
            className="rounded-lg border px-3 py-2"
          />
          <input
            name="startTime"
            type="time"
            defaultValue={startTimeValue}
            className="rounded-lg border px-3 py-2"
          />
          <input
            name="endTime"
            type="time"
            defaultValue={endTimeValue}
            className="rounded-lg border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="allDay"
            defaultChecked={editingEvent?.allDay ?? false}
          />
          All-day event
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            name="categoryId"
            defaultValue={editingEvent?.categoryId ?? ""}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="assignedToId"
            defaultValue={editingEvent?.assignedToId ?? ""}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {state.message ? (
          <div
            className={`rounded-lg px-3 py-2 text-sm ${
              state.ok
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-700 ring-1 ring-red-200"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div>
            <ActionButton
                variant="primary"
                icon={isEditing ? "save" : "plus"}
                ariaLabel={isEditing ? "Save changes" : "Create event"}
            >
                {isEditing ? "Save changes" : "Create event"}
            </ActionButton>
        </div>
      </form>
    </div>
  );
}