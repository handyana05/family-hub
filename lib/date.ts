import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type CalendarView = "day" | "week" | "month";

export function parseDateParam(date?: string): Date {
  if (!date) return startOfDay(new Date());

  const parsed = parseISO(date);
  if (Number.isNaN(parsed.getTime())) {
    return startOfDay(new Date());
  }

  return startOfDay(parsed);
}

export function formatDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getViewFromParam(view?: string): CalendarView {
  if (view === "day" || view === "week" || view === "month") return view;
  return "day";
}

export function startOfCalendarWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function endOfCalendarWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function startOfCalendarMonthGrid(date: Date): Date {
  return startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
}

export function endOfCalendarMonthGrid(date: Date): Date {
  return endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
}

export function shiftDateByView(date: Date, view: CalendarView, amount: number): Date {
  if (view === "day") return addDays(date, amount);
  if (view === "week") return addWeeks(date, amount);
  return addMonths(date, amount);
}