import Link from "next/link";
import { format } from "date-fns";
import { formatDateParam } from "@/lib/date";
import { getEventChipStyle } from "@/lib/ui";
import type { CalendarEventDto } from "@/lib/services/calendar-service";

type MonthDay = {
  date: Date;
  key: string;
  inCurrentMonth: boolean;
  events: CalendarEventDto[];
};

type MonthGridProps = {
  weeks: Array<{
    days: MonthDay[];
  }>;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthGrid({ weeks }: MonthGridProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="p-2 text-xs font-medium text-slate-500 sm:p-3 sm:text-sm dark:text-slate-400">
            {label}
          </div>
        ))}
      </div>

      <div className="divide-y">
        {weeks.map((week, index) => (
          <div key={index} className="grid grid-cols-7 divide-x">
            {week.days.map((day) => (
              <div
                key={day.key}
                className={`min-h-24 p-2 sm:min-h-36 ${
                  day.inCurrentMonth ? "bg-white" : "bg-slate-50"
                }`}
              >
                <Link
                  href={`/calendar?view=day&date=${formatDateParam(day.date)}`}
                  className="inline-flex rounded px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {format(day.date, "d")}
                </Link>

                <div className="mt-2 space-y-1">
                  {day.events.slice(0, 4).map((event) => (
                    <Link
                      key={event.id}
                      href={`/calendar?view=month&date=${formatDateParam(day.date)}&eventId=${event.id}`}
                      className="block truncate rounded-md border px-2 py-1 text-xs font-medium hover:opacity-90"
                      style={getEventChipStyle(event.categoryColor)}
                      title={event.title}
                    >
                      {event.allDay ? "• " : `${format(event.startAt, "HH:mm")} `}
                      {event.title}
                    </Link>
                  ))}

                  {day.events.length > 4 ? (
                    <div className="px-2 text-xs text-slate-500 dark:text-slate-400">
                      +{day.events.length - 4} more
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}