import Link from "next/link";
import { format } from "date-fns";
import { formatDateParam } from "@/lib/date";
import { getEventChipStyle } from "@/lib/ui";
import {
  completeShoppingFromWallAction,
  completeTodoFromWallAction,
  reopenTodoFromWallAction,
} from "../actions";
import { WallSwipeHint } from "./wall-swipe-hint";
import { WallActionButton } from "./wall-action-button";
import type {
  WallEventDto,
  WallNoteDto,
  WallShoppingItemDto,
  WallTodoDto,
} from "@/lib/services/wall-service";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type MonthDay = {
  date: Date;
  key: string;
  inCurrentMonth: boolean;
  isSelected: boolean;
  events: WallEventDto[];
  eventCount: number;
  dueTodoCount: number;
};

type WallMonthViewProps = {
  viewDate: Date;
  selectedDate: Date;
  weeks: Array<{
    days: MonthDay[];
  }>;
  recentPastEvents: WallEventDto[];
  openTodos: WallTodoDto[];
  completedTodos: WallTodoDto[];
  shoppingItems: WallShoppingItemDto[];
  pinnedNote: WallNoteDto | null;
  selectedDayEvents: WallEventDto[];
  selectedDayOpenTodos: WallTodoDto[];
  selectedDayCompletedTodos: WallTodoDto[];
};

export function WallMonthView({
  viewDate,
  selectedDate,
  weeks,
  recentPastEvents,
  openTodos,
  completedTodos,
  shoppingItems,
  pinnedNote,
  selectedDayEvents,
  selectedDayOpenTodos,
  selectedDayCompletedTodos,
}: WallMonthViewProps) {
  const viewDateParam = formatDateParam(viewDate);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold">Month view</h2>
            <WallSwipeHint />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-7 border-b border-white/10 bg-slate-100 dark:bg-white/5">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="p-4 text-lg font-medium text-slate-300">
                  {label}
                </div>
              ))}
            </div>

            <div className="divide-y divide-white/10">
              {weeks.map((week, index) => (
                <div key={index} className="grid grid-cols-7 divide-x divide-white/10">
                  {week.days.map((day) => (
                    <Link
                      key={day.key}
                      href={`/wall?view=month&date=${viewDateParam}&selected=${day.key}`}
                      className={`block min-h-40 p-3 transition ${
                        day.inCurrentMonth ? "bg-transparent" : "bg-slate-100 dark:bg-white/5"
                      } ${day.isSelected ? "ring-2 ring-amber-300 ring-inset bg-white/10" : "hover:bg-slate-100 dark:bg-white/5"}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-lg font-semibold text-white">
                          {format(day.date, "d")}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {day.eventCount > 0 ? (
                            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-200 ring-1 ring-sky-400/20">
                              {day.eventCount}E
                            </span>
                          ) : null}

                          {day.dueTodoCount > 0 ? (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200 ring-1 ring-amber-400/20">
                              {day.dueTodoCount}T
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {day.events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="truncate rounded-lg border px-2 py-1 text-sm font-medium"
                            style={getEventChipStyle(event.categoryColor)}
                            title={event.title}
                          >
                            {event.allDay ? "• " : `${format(event.startAt, "HH:mm")} `}
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 3 ? (
                          <div className="text-sm text-slate-500 dark:text-slate-400">+{day.events.length - 3} more</div>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <h2 className="text-3xl font-semibold">Selected day</h2>
          <p className="mt-2 text-xl text-slate-300">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>

          <div className="mt-6 space-y-6">
            <section>
              <h3 className="mb-3 text-2xl font-semibold">Events</h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-lg text-slate-500 dark:text-slate-400">No events.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border px-4 py-3"
                      style={getEventChipStyle(event.categoryColor)}
                    >
                      <p className="text-xl font-medium">{event.title}</p>
                      <p className="mt-1 text-base opacity-80">
                        {event.allDay ? "All day" : format(event.startAt, "HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-3 text-2xl font-semibold">Todos due that day</h3>
              {selectedDayOpenTodos.length === 0 ? (
                <p className="text-lg text-slate-500 dark:text-slate-400">No due todos.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayOpenTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-slate-100 dark:bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-xl font-medium">{todo.title}</p>
                        <p className="mt-1 text-base text-slate-300">
                          {todo.dueAt ? format(todo.dueAt, "HH:mm") : "No time"}
                        </p>
                      </div>

                      <form action={completeTodoFromWallAction}>
                        <input type="hidden" name="todoId" value={todo.id} />
                        <WallActionButton type="done" label="Done" />
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-3 text-2xl font-semibold">Completed that day</h3>
              {selectedDayCompletedTodos.length === 0 ? (
                <p className="text-lg text-slate-500 dark:text-slate-400">No completed todos.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayCompletedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3"
                    >
                      <div>
                        <p className="text-xl font-medium text-emerald-100">{todo.title}</p>
                        <p className="mt-1 text-base text-emerald-200/80">
                          {todo.completedAt ? format(todo.completedAt, "HH:mm") : "Done"}
                        </p>
                      </div>

                      <form action={reopenTodoFromWallAction}>
                        <input type="hidden" name="todoId" value={todo.id} />
                        <WallActionButton type="reopen" label="Reopen" />
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Open todos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quick actions enabled</p>
          </div>

          <div className="space-y-3">
            {openTodos.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">All clear.</p>
            ) : (
              openTodos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-100 dark:bg-white/5 px-5 py-4">
                  <div>
                    <p className="text-2xl font-medium">{todo.title}</p>
                    <p className="mt-1 text-lg text-slate-300">
                      {todo.dueAt ? `Due ${format(todo.dueAt, "MMM d · HH:mm")}` : "No due date"}
                    </p>
                  </div>

                  <form action={completeTodoFromWallAction}>
                    <input type="hidden" name="todoId" value={todo.id} />
                    <WallActionButton type="done" label="Done" />
                  </form>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Completed recently</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Can be reopened</p>
          </div>

          <div className="space-y-3">
            {completedTodos.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">No recent completions.</p>
            ) : (
              completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4"
                >
                  <div>
                    <p className="text-2xl font-medium text-emerald-100">{todo.title}</p>
                    <p className="mt-1 text-lg text-emerald-200/80">
                      {todo.completedAt ? `Completed ${format(todo.completedAt, "MMM d · HH:mm")}` : "Done"}
                    </p>
                  </div>

                  <form action={reopenTodoFromWallAction}>
                    <input type="hidden" name="todoId" value={todo.id} />
                    <WallActionButton type="reopen" label="Reopen" />
                  </form>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Shopping</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quick actions enabled</p>
          </div>

          <div className="space-y-3">
            {shoppingItems.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">Nothing to buy.</p>
            ) : (
              shoppingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-100 dark:bg-white/5 px-5 py-4">
                  <div>
                    <p className="text-2xl font-medium">{item.name}</p>
                    {item.quantity ? (
                      <p className="mt-1 text-lg text-slate-300">{item.quantity}</p>
                    ) : null}
                  </div>

                  <form action={completeShoppingFromWallAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <WallActionButton type="done" label="Done" />
                  </form>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-100 dark:bg-white/5 p-6 ring-1 ring-slate-200 dark:ring-white/10">
          <h2 className="mb-4 text-3xl font-semibold">Recent past events</h2>
          <div className="space-y-3">
            {recentPastEvents.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">No recent past events.</p>
            ) : (
              recentPastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border px-5 py-4 opacity-75"
                  style={getEventChipStyle(event.categoryColor)}
                >
                  <p className="text-2xl font-medium">{event.title}</p>
                  <p className="mt-1 text-lg opacity-80">
                    {event.allDay ? format(event.startAt, "MMM d") : format(event.startAt, "MMM d · HH:mm")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-3xl bg-amber-300 p-6 text-slate-950">
        <h2 className="mb-3 text-3xl font-semibold">Pinned note</h2>
        {pinnedNote ? (
          <>
            <p className="text-2xl font-medium">{pinnedNote.title}</p>
            <p className="mt-3 whitespace-pre-wrap text-xl leading-relaxed">
              {pinnedNote.content}
            </p>
          </>
        ) : (
          <p className="text-xl">No pinned note.</p>
        )}
      </section>
    </div>
  );
}