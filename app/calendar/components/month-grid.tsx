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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="p-2 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:p-3 sm:text-sm"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {weeks.map((week, index) => (
          <div key={index} className="grid grid-cols-7 divide-x divide-slate-200 dark:divide-slate-800">
            {week.days.map((day) => (
              <div
                key={day.key}
                className={`min-h-24 p-1.5 sm:min-h-36 sm:p-2 ${
                  day.inCurrentMonth
                    ? "bg-white dark:bg-slate-900"
                    : "bg-slate-50 dark:bg-slate-950"
                }`}
              >
                <Link
                  href={`/calendar?view=day&date=${formatDateParam(day.date)}`}
                  className="inline-flex rounded px-1.5 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-2 sm:py-1 sm:text-sm"
                >
                  {format(day.date, "d")}
                </Link>

                <div className="mt-1.5 space-y-1 sm:mt-2">
                  {day.events.slice(0, 2).map((event) => (
                    <Link
                      key={event.id}
                      href={`/calendar?view=month&date=${formatDateParam(day.date)}&eventId=${event.id}`}
                      className="block truncate rounded-md border px-1.5 py-0.5 text-[10px] font-medium hover:opacity-90 sm:px-2 sm:py-1 sm:text-xs"
                      style={getEventChipStyle(event.categoryColor)}
                      title={event.title}
                    >
                      {event.allDay ? "• " : `${format(event.startAt, "HH:mm")} `}
                      {event.title}
                    </Link>
                  ))}

                  {day.events.length > 2 ? (
                    <div className="px-1.5 text-[10px] text-slate-500 dark:text-slate-400 sm:px-2 sm:text-xs">
                      +{day.events.length - 2} more
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