import { format } from "date-fns";
import { requireUser } from "@/lib/auth";
import { getViewFromParam, parseDateParam, formatDateParam } from "@/lib/date";
import { getTheme } from "@/lib/theme";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";
import {
  getWallDayViewData,
  getWallMonthViewData,
  getWallWeekViewData,
} from "@/lib/services/wall-service";
import { WallToolbar } from "./components/wall-toolbar";
import { WallDayView } from "./components/wall-day-view";
import { WallWeekView } from "./components/wall-week-view";
import { WallMonthView } from "./components/wall-month-view";
import { WallSwipeNav } from "./components/wall-swipe-nav";

export const revalidate = 60;

type WallPageProps = {
  searchParams?: Promise<{
    view?: string;
    date?: string;
    selected?: string;
  }>;
};

export default async function WallPage({ searchParams }: WallPageProps) {
  const session = await requireUser();
  const currentTheme = await getTheme();
  const params = (await searchParams) ?? {};

  const view = getViewFromParam(params.view);
  const date = parseDateParam(params.date);
  const selectedDate = parseDateParam(params.selected ?? params.date);

  const wallData =
    view === "day"
      ? await getWallDayViewData(session.householdId, date)
      : view === "week"
      ? await getWallWeekViewData(session.householdId, date)
      : await getWallMonthViewData(session.householdId, date, selectedDate);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <WallSwipeNav view={view} date={formatDateParam(date)}>
        <div className="mx-auto max-w-7xl px-8 py-8">
          <header className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6 dark:border-white/10">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight">Family Hub</h1>
              <p className="mt-3 text-2xl text-slate-600 dark:text-slate-300">
                {format(wallData.now, "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <div className="text-right">
                <div className="text-6xl font-semibold tabular-nums">
                  {format(wallData.now, "HH:mm")}
                </div>
                <p className="mt-2 text-xl text-slate-500 dark:text-slate-400">
                  Wall mode
                </p>
              </div>

              <div className="pb-2">
                <ThemeToggleIcon currentTheme={currentTheme} />
              </div>
            </div>
          </header>

          <WallToolbar view={view} date={date} />

          {wallData.view === "day" ? (
            <WallDayView
              todayEvents={wallData.todayEvents}
              recentPastEvents={wallData.recentPastEvents}
              openTodos={wallData.openTodos}
              completedTodos={wallData.completedTodos}
              shoppingItems={wallData.shoppingItems}
              pinnedNote={wallData.pinnedNote}
            />
          ) : null}

          {wallData.view === "week" ? (
            <WallWeekView
              days={wallData.days}
              recentPastEvents={wallData.recentPastEvents}
              openTodos={wallData.openTodos}
              completedTodos={wallData.completedTodos}
              shoppingItems={wallData.shoppingItems}
              pinnedNote={wallData.pinnedNote}
            />
          ) : null}

          {wallData.view === "month" ? (
            <WallMonthView
              viewDate={date}
              selectedDate={wallData.selectedDate}
              weeks={wallData.weeks}
              recentPastEvents={wallData.recentPastEvents}
              openTodos={wallData.openTodos}
              completedTodos={wallData.completedTodos}
              shoppingItems={wallData.shoppingItems}
              pinnedNote={wallData.pinnedNote}
              selectedDayEvents={wallData.selectedDayEvents}
              selectedDayOpenTodos={wallData.selectedDayOpenTodos}
              selectedDayCompletedTodos={wallData.selectedDayCompletedTodos}
            />
          ) : null}
        </div>
      </WallSwipeNav>

      <script
        dangerouslySetInnerHTML={{
          __html: "setTimeout(() => window.location.reload(), 60000);",
        }}
      />
    </main>
  );
}