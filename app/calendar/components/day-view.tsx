import Link from "next/link";
import { format } from "date-fns";
import { getEventChipStyle } from "@/lib/ui";
import type { CalendarEventDto } from "@/lib/services/calendar-service";

type DayViewProps = {
  events: CalendarEventDto[];
  viewDate: Date;
};

export function DayView({ events, viewDate }: DayViewProps) {
  const dateParam = format(viewDate, "yyyy-MM-dd");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Day view</h2>

      {events.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          No events for this day.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/calendar?view=day&date=${dateParam}&eventId=${event.id}`}
              className="block rounded-2xl border p-4 transition hover:opacity-95"
              style={getEventChipStyle(event.categoryColor)}
            >
              <p className="text-base font-medium sm:text-lg">{event.title}</p>
              <p className="mt-1 text-sm opacity-80">
                {event.allDay
                  ? "All day"
                  : `${format(event.startAt, "HH:mm")}${
                      event.endAt ? ` - ${format(event.endAt, "HH:mm")}` : ""
                    }`}
              </p>
              {event.categoryName ? (
                <p className="mt-1 text-sm opacity-75">Category: {event.categoryName}</p>
              ) : null}
              {event.assignedToName ? (
                <p className="mt-1 text-sm opacity-75">Assigned: {event.assignedToName}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}