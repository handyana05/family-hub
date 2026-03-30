import { format } from "date-fns";
import { getEventChipStyle } from "@/lib/ui";
import {
  completeShoppingFromWallAction,
  completeTodoFromWallAction,
  reopenTodoFromWallAction,
} from "../actions";
import { WallActionButton } from "./wall-action-button";
import { WallSwipeHint } from "./wall-swipe-hint";
import type {
  WallEventDto,
  WallNoteDto,
  WallShoppingItemDto,
  WallTodoDto,
} from "@/lib/services/wall-service";

type WallDayViewProps = {
  todayEvents: WallEventDto[];
  recentPastEvents: WallEventDto[];
  openTodos: WallTodoDto[];
  completedTodos: WallTodoDto[];
  shoppingItems: WallShoppingItemDto[];
  pinnedNote: WallNoteDto | null;
};

export function WallDayView({
  todayEvents,
  recentPastEvents,
  openTodos,
  completedTodos,
  shoppingItems,
  pinnedNote,
}: WallDayViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl bg-slate-100 p-6 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Today’s events</h2>
          <WallSwipeHint />
        </div>
        {todayEvents.length === 0 ? (
          <p className="text-xl text-slate-500 dark:text-slate-400">No events today.</p>
        ) : (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border px-5 py-4"
                style={getEventChipStyle(event.categoryColor)}
              >
                <p className="text-2xl font-medium">{event.title}</p>
                <p className="mt-1 text-lg opacity-80">
                  {event.allDay ? "All day" : format(event.startAt, "HH:mm")}
                  {event.assignedToName ? ` · ${event.assignedToName}` : ""}
                </p>
                {event.categoryName ? (
                  <p className="mt-1 text-sm opacity-75">{event.categoryName}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-slate-100 p-6 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Open todos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tap done for quick completion</p>
        </div>

        {openTodos.length === 0 ? (
          <p className="text-xl text-slate-500 dark:text-slate-400">All clear.</p>
        ) : (
          <div className="space-y-3">
            {openTodos.slice(0, 6).map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
              >
                <div>
                  <p className="text-2xl font-medium text-slate-950 dark:text-white">{todo.title}</p>
                  <p className="mt-1 text-lg text-slate-500 dark:text-slate-300">
                    {todo.dueAt ? `Due ${format(todo.dueAt, "MMM d · HH:mm")}` : "No due date"}
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

      <section className="rounded-3xl bg-slate-100 p-6 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Recently completed</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Can be reopened</p>
        </div>

        {completedTodos.length === 0 ? (
          <p className="text-xl text-slate-500 dark:text-slate-400">Nothing completed recently.</p>
        ) : (
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 dark:border-emerald-400/20 dark:bg-emerald-500/10"
              >
                <div>
                  <p className="text-2xl font-medium text-emerald-800 dark:text-emerald-100">{todo.title}</p>
                  <p className="mt-1 text-lg text-emerald-700 dark:text-emerald-200/80">
                    {todo.completedAt ? `Completed ${format(todo.completedAt, "MMM d · HH:mm")}` : "Done"}
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

      <section className="rounded-3xl bg-slate-100 p-6 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <h2 className="mb-4 text-3xl font-semibold text-slate-950 dark:text-white">Recent past events</h2>
        {recentPastEvents.length === 0 ? (
          <p className="text-xl text-slate-500 dark:text-slate-400">No recent past events.</p>
        ) : (
          <div className="space-y-3">
            {recentPastEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border px-5 py-4 opacity-85"
                style={getEventChipStyle(event.categoryColor)}
              >
                <p className="text-2xl font-medium">{event.title}</p>
                <p className="mt-1 text-lg opacity-80">
                  {event.allDay ? format(event.startAt, "MMM d") : format(event.startAt, "MMM d · HH:mm")}
                </p>
                {event.categoryName ? (
                  <p className="mt-1 text-sm opacity-75">{event.categoryName}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-slate-100 p-6 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Shopping</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tap done for quick completion</p>
        </div>

        {shoppingItems.length === 0 ? (
          <p className="text-xl text-slate-500 dark:text-slate-400">Nothing to buy.</p>
        ) : (
          <div className="space-y-3">
            {shoppingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
              >
                <div>
                  <p className="text-2xl font-medium text-slate-950 dark:text-white">{item.name}</p>
                  {item.quantity ? (
                    <p className="mt-1 text-lg text-slate-500 dark:text-slate-300">{item.quantity}</p>
                  ) : null}
                </div>

                <form action={completeShoppingFromWallAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <WallActionButton type="done" label="Done" />
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

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