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

type WallToolbarProps = {
  view: CalendarView;
  date: Date;
};

function ViewIcon({ view, className = "h-5 w-5" }: { view: CalendarView; className?: string }) {
  if (view === "day") return <RectangleHorizontal className={className} />;
  if (view === "week") return <Columns3 className={className} />;
  return <CalendarDays className={className} />;
}

function viewLabel(view: CalendarView) {
  if (view === "day") return "Day";
  if (view === "week") return "Week";
  return "Month";
}

export function WallToolbar({ view, date }: WallToolbarProps) {
  const prevDate = shiftDateByView(date, view, -1);
  const nextDate = shiftDateByView(date, view, 1);
  const today = new Date();

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-100 p-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <Link
          href={`/wall?view=${view}&date=${formatDateParam(prevDate)}`}
          className="inline-flex items-center justify-center rounded-xl bg-white p-3 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15 sm:gap-2 sm:px-4 sm:py-3"
          aria-label="Previous"
          title="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Prev</span>
        </Link>

        <Link
          href={`/wall?view=${view}&date=${formatDateParam(today)}`}
          className="inline-flex items-center justify-center rounded-xl bg-white p-3 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15 sm:gap-2 sm:px-4 sm:py-3"
          aria-label="Today"
          title="Today"
        >
          <SunMedium className="h-5 w-5" />
          <span className="hidden sm:inline">Today</span>
        </Link>

        <Link
          href={`/wall?view=${view}&date=${formatDateParam(nextDate)}`}
          className="inline-flex items-center justify-center rounded-xl bg-white p-3 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15 sm:gap-2 sm:px-4 sm:py-3"
          aria-label="Next"
          title="Next"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="hidden sm:inline">Next</span>
        </Link>
      </div>

      <div className="text-center text-2xl font-semibold text-slate-900 dark:text-white">
        {view === "day" && format(date, "EEEE, MMMM d, yyyy")}
        {view === "week" && `Week of ${format(date, "MMMM d, yyyy")}`}
        {view === "month" && format(date, "MMMM yyyy")}
      </div>

      <div className="flex items-center gap-3">
        {(["day", "week", "month"] as const).map((option) => (
          <Link
            key={option}
            href={`/wall?view=${option}&date=${formatDateParam(date)}`}
            className={`inline-flex items-center justify-center rounded-xl p-3 sm:gap-2 sm:px-4 sm:py-3 ${
              view === option
                ? "bg-white text-slate-950 ring-1 ring-slate-200 dark:bg-white dark:text-slate-950 dark:ring-0"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            }`}
            aria-label={viewLabel(option)}
            title={viewLabel(option)}
          >
            <ViewIcon view={option} />
            <span className="hidden sm:inline">{viewLabel(option)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}