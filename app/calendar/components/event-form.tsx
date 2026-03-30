import { CalendarView, formatDateParam } from "@/lib/date";
import { deleteEventAction } from "../actions";
import { EventFormClient } from "./event-form-client";
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

type EventFormProps = {
  defaultDate: string;
  categories: Option[];
  users: Option[];
  editingEvent?: EditableEvent | null;
  currentView: CalendarView;
  currentDate: Date;
};

export function EventForm({
  defaultDate,
  categories,
  users,
  editingEvent,
  currentView,
  currentDate,
}: EventFormProps) {
  const returnTo = `/calendar?view=${currentView}&date=${formatDateParam(currentDate)}`;

  return (
    <div className="space-y-3">
      <EventFormClient
        defaultDate={defaultDate}
        categories={categories}
        users={users}
        editingEvent={editingEvent}
        currentView={currentView}
        currentDate={currentDate}
      />

      {editingEvent ? (
        <form action={deleteEventAction} className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <input type="hidden" name="eventId" value={editingEvent.id} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <ActionButton variant="danger" icon="delete" ariaLabel="Delete event">
            Delete
          </ActionButton>
        </form>
      ) : null}
    </div>
  );
}