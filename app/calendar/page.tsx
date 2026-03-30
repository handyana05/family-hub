import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  formatDateParam,
  getViewFromParam,
  parseDateParam,
} from "@/lib/date";
import {
  getCalendarDayData,
  getCalendarMonthData,
  getCalendarWeekData,
} from "@/lib/services/calendar-service";
import { CalendarToolbar } from "./components/calendar-toolbar";
import { EventForm } from "./components/event-form";
import { DayView } from "./components/day-view";
import { WeekView } from "./components/week-view";
import { MonthGrid } from "./components/month-grid";

type CalendarPageProps = {
  searchParams?: Promise<{
    view?: string;
    date?: string;
    eventId?: string;
  }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const session = await requireUser();
  const params = (await searchParams) ?? {};

  const view = getViewFromParam(params.view);
  const date = parseDateParam(params.date);

  const [categories, users, calendarData, editingEvent] = await Promise.all([
    db.category.findMany({
      where: { householdId: session.householdId, type: "CALENDAR" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.user.findMany({
      where: { householdId: session.householdId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    view === "day"
      ? getCalendarDayData(session.householdId, date)
      : view === "week"
      ? getCalendarWeekData(session.householdId, date)
      : getCalendarMonthData(session.householdId, date),
    params.eventId
      ? db.calendarEvent.findFirst({
          where: {
            id: params.eventId,
            householdId: session.householdId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            startAt: true,
            endAt: true,
            allDay: true,
            categoryId: true,
            assignedToId: true,
          },
        })
      : Promise.resolve(null),
  ]);

  return (
    <AppShell title="Calendar" subtitle="Custom household calendar with day, week, and month views.">
      <CalendarToolbar view={view} date={date} />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          {calendarData.view === "day" ? (
            <DayView events={calendarData.events} viewDate={date} />
          ) : null}

          {calendarData.view === "week" ? (
            <WeekView days={calendarData.days} />
          ) : null}

          {calendarData.view === "month" ? (
            <MonthGrid weeks={calendarData.weeks} />
          ) : null}
        </div>

        <div>
          <EventForm
            defaultDate={formatDateParam(date)}
            categories={categories}
            users={users}
            editingEvent={editingEvent}
            currentView={view}
            currentDate={date}
          />
        </div>
      </div>
    </AppShell>
  );
}