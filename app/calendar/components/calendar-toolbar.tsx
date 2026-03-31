import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  RectangleHorizontal,
  SunMedium,
} from "lucide-react";
import { CalendarView, formatDateParam, shiftDateByView } from "@/lib/date";

type CalendarToolbarProps = {
  view: CalendarView;
  date: Date;
};

function ViewIcon({ view, className = "h-4 w-4" }: { view: CalendarView; className?: string }) {
  if (view === "day") return <RectangleHorizontal className={className} />;
  if (view === "week") return <Columns3 className={className} />;
  return <CalendarDays className={className} />;
}

function viewLabel(view: CalendarView) {
  if (view === "day") return "Day";
  if (view === "week") return "Week";
  return "Month";
}

export function CalendarToolbar({ view, date }: CalendarToolbarProps) {
  const prevDate = shiftDateByView(date, view, -1);
  const nextDate = shiftDateByView(date, view, 1);
  const today = new Date();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/calendar?view=${view}&date=${formatDateParam(prevDate)}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Previous"
            title="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Prev</span>
          </Link>

          <Link
            href={`/calendar?view=${view}&date=${formatDateParam(today)}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Today"
            title="Today"
          >
            <SunMedium className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Today</span>
          </Link>

          <Link
            href={`/calendar?view=${view}&date=${formatDateParam(nextDate)}`}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Next"
            title="Next"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Next</span>
          </Link>
        </div>

        <div className="text-left text-lg font-semibold text-slate-950 dark:text-slate-100 lg:text-center">
          {view === "day" && format(date, "EEEE, MMMM d, yyyy")}
          {view === "week" && `Week of ${format(date, "MMMM d, yyyy")}`}
          {view === "month" && format(date, "MMMM yyyy")}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["day", "week", "month"] as const).map((option) => (
            <Link
              key={option}
              href={`/calendar?view=${option}&date=${formatDateParam(date)}`}
              className={`inline-flex min-h-10 items-center justify-center rounded-lg px-3 ${
                view === option
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
              aria-label={viewLabel(option)}
              title={viewLabel(option)}
            >
              <ViewIcon view={option} />
              <span className="ml-2 hidden sm:inline">{viewLabel(option)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}