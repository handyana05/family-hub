import Link from "next/link";
import { format } from "date-fns";
import { formatDateParam } from "@/lib/date";
import { getEventChipStyle } from "@/lib/ui";
import type { CalendarEventDto } from "@/lib/services/calendar-service";

type DayBucket = {
  date: Date;
  key: string;
  events: CalendarEventDto[];
};

type WeekViewProps = {
  days: DayBucket[];
};

export function WeekView({ days }: WeekViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
      {days.map((day) => (
        <div
          key={day.key}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{format(day.date, "EEE")}</p>
              <p className="font-semibold text-slate-950 dark:text-slate-100">{format(day.date, "MMM d")}</p>
            </div>

            <Link
              href={`/calendar?view=day&date=${formatDateParam(day.date)}`}
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Open
            </Link>
          </div>

          {day.events.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No events</p>
          ) : (
            <div className="space-y-2">
              {day.events.map((event) => (
                <Link
                  key={event.id}
                  href={`/calendar?view=week&date=${formatDateParam(day.date)}&eventId=${event.id}`}
                  className="block rounded-xl border p-3 transition hover:opacity-95"
                  style={getEventChipStyle(event.categoryColor)}
                >
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-1 text-xs opacity-80">
                    {event.allDay ? "All day" : format(event.startAt, "HH:mm")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}