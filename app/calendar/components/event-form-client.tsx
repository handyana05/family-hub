"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction] = useActionState(
    isEditing ? updateEventAction : createEventAction,
    initialState
  );

  const [visibleMessage, setVisibleMessage] = useState("");

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

  /**
   * Message behavior:
   * - Success/info messages auto-hide after 4.5s
   * - Validation/error messages stay visible
   */
  useEffect(() => {
    if (!state.message) {
      setVisibleMessage("");
      return;
    }

    setVisibleMessage(state.message);

    // Only auto-hide success/info messages
    if (state.ok) {
      const timer = window.setTimeout(() => {
        setVisibleMessage("");
      }, 4500);

      return () => window.clearTimeout(timer);
    }
  }, [state.message, state.ok]);

  useEffect(() => {
    if (!editingEvent?.id) return;

    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const focusTimer = window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 350);

    return () => window.clearTimeout(focusTimer);
  }, [editingEvent?.id]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
            {isEditing ? "Edit event" : "Add event"}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isEditing ? "Update the selected event." : "Quick event entry for mobile and desktop."}
          </p>
        </div>

        {isEditing ? (
          <Link
            href={clearSelectionHref}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Clear
          </Link>
        ) : null}
      </div>

      <form ref={formRef} action={formAction} className="space-y-3 overflow-x-hidden">
        {isEditing ? (
          <input type="hidden" name="eventId" value={editingEvent!.id} />
        ) : null}

        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="w-full min-w-0 max-w-full">
          <input
            ref={titleInputRef}
            name="title"
            placeholder="Event title"
            required
            defaultValue={editingEvent?.title ?? ""}
            className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="w-full min-w-0 max-w-full">
          <textarea
            name="description"
            placeholder="Description (optional)"
            rows={3}
            defaultValue={editingEvent?.description ?? ""}
            className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-3 sm:grid sm:min-w-0 sm:grid-cols-3 sm:gap-3 sm:space-y-0">
          <div className="w-full min-w-0 max-w-full">
            <input
              name="date"
              type="date"
              defaultValue={dateValue}
              required
              className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="w-full min-w-0 max-w-full">
            <input
              name="startTime"
              type="time"
              defaultValue={startTimeValue}
              className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="w-full min-w-0 max-w-full">
            <input
              name="endTime"
              type="time"
              defaultValue={endTimeValue}
              className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
          <input
            type="checkbox"
            name="allDay"
            defaultChecked={editingEvent?.allDay ?? false}
          />
          All-day event
        </label>

        <div className="space-y-3 sm:grid sm:min-w-0 sm:grid-cols-2 sm:gap-3 sm:space-y-0">
          <div className="w-full min-w-0 max-w-full">
            <select
              name="categoryId"
              defaultValue={editingEvent?.categoryId ?? ""}
              className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full min-w-0 max-w-full">
            <select
              name="assignedToId"
              defaultValue={editingEvent?.assignedToId ?? ""}
              className="block w-full min-w-0 max-w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visibleMessage ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              state.ok
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-800"
                : "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-800"
            }`}
          >
            {visibleMessage}
          </div>
        ) : null}

        <div>
          <ActionButton
            variant="primary"
            icon={isEditing ? "save" : "plus"}
            ariaLabel={isEditing ? "Save changes" : "Create event"}
            className="w-full justify-center py-3 sm:w-auto"
          >
            {isEditing ? "Save changes" : "Create event"}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}