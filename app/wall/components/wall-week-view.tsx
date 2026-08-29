import { format } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pin,
  ShoppingCart,
  Star,
} from "lucide-react";

import { getEventChipStyle } from "@/lib/ui";
import {
  completeShoppingFromWallAction,
  completeTodoFromWallAction,
  reopenTodoFromWallAction,
} from "../actions";
import { WallActionButton } from "./wall-action-button";
import { WallCard } from "./wall-card";

import type {
  WallEventDto,
  WallNoteDto,
  WallShoppingItemDto,
  WallTodoDto,
} from "@/lib/services/wall-service";

type WeekDayBucket = {
  date: Date;
  key: string;
  events: WallEventDto[];
};

type WallWeekViewProps = {
  days: WeekDayBucket[];
  recentPastEvents: WallEventDto[];
  openTodos: WallTodoDto[];
  completedTodos: WallTodoDto[];
  shoppingItems: WallShoppingItemDto[];
  pinnedNote: WallNoteDto | null;
};

export function WallWeekView({
  days,
  recentPastEvents,
  openTodos,
  completedTodos,
  shoppingItems,
  pinnedNote,
}: WallWeekViewProps) {
  return (
    <div className="space-y-6">
      <WallCard
        title="This week"
        icon={CalendarDays}
        iconTone="violet"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {days.map((day) => (
            <div
              key={day.key}
              className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
            >
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {format(day.date, "EEE")}
              </p>

              <p className="mb-3 text-2xl font-semibold text-slate-950 dark:text-white">
                {format(day.date, "d")}
              </p>

              {day.events.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No events
                </p>
              ) : (
                <div className="space-y-2">
                  {day.events.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border px-3 py-2"
                      style={getEventChipStyle(event.categoryColor)}
                    >
                      <p className="text-base font-medium">
                        {event.title}
                      </p>

                      <p className="text-sm opacity-80">
                        {event.allDay
                          ? "All day"
                          : format(event.startAt, "HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </WallCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <WallCard
          title="Open todos"
          subtitle="Quick actions enabled"
          icon={CheckCircle2}
          iconTone="green"
        >
          <div className="space-y-3">
            {openTodos.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">
                All clear.
              </p>
            ) : (
              openTodos.slice(0, 8).map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
                >
                  <div>
                    <p className="text-2xl font-medium text-slate-950 dark:text-white">
                      {todo.title}
                    </p>

                    <p className="mt-1 text-lg text-slate-500 dark:text-slate-300">
                      {todo.dueAt
                        ? `Due ${format(
                            todo.dueAt,
                            "MMM d · HH:mm",
                          )}`
                        : "No due date"}
                    </p>
                  </div>

                  <form action={completeTodoFromWallAction}>
                    <input
                      type="hidden"
                      name="todoId"
                      value={todo.id}
                    />

                    <WallActionButton
                      type="done"
                      label="Done"
                    />
                  </form>
                </div>
              ))
            )}
          </div>
        </WallCard>

        <WallCard
          title="Completed recently"
          subtitle="Can be reopened"
          icon={Star}
          iconTone="amber"
        >
          <div className="space-y-3">
            {completedTodos.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">
                No recent completions.
              </p>
            ) : (
              completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                >
                  <div>
                    <p className="text-2xl font-medium text-emerald-800 dark:text-emerald-100">
                      {todo.title}
                    </p>

                    <p className="mt-1 text-lg text-emerald-700 dark:text-emerald-200/80">
                      {todo.completedAt
                        ? `Completed ${format(
                            todo.completedAt,
                            "MMM d · HH:mm",
                          )}`
                        : "Done"}
                    </p>
                  </div>

                  <form action={reopenTodoFromWallAction}>
                    <input
                      type="hidden"
                      name="todoId"
                      value={todo.id}
                    />

                    <WallActionButton
                      type="reopen"
                      label="Reopen"
                    />
                  </form>
                </div>
              ))
            )}
          </div>
        </WallCard>

        <WallCard
          title="Shopping"
          subtitle="Quick actions enabled"
          icon={ShoppingCart}
          iconTone="blue"
        >
          <div className="space-y-3">
            {shoppingItems.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">
                Nothing to buy.
              </p>
            ) : (
              shoppingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10"
                >
                  <div>
                    <p className="text-2xl font-medium text-slate-950 dark:text-white">
                      {item.name}
                    </p>

                    {item.quantity ? (
                      <p className="mt-1 text-lg text-slate-500 dark:text-slate-300">
                        {item.quantity}
                      </p>
                    ) : null}
                  </div>

                  <form action={completeShoppingFromWallAction}>
                    <input
                      type="hidden"
                      name="itemId"
                      value={item.id}
                    />

                    <WallActionButton
                      type="done"
                      label="Done"
                    />
                  </form>
                </div>
              ))
            )}
          </div>
        </WallCard>

        <WallCard
          title="Recent past events"
          icon={Clock3}
          iconTone="purple"
        >
          <div className="space-y-3">
            {recentPastEvents.length === 0 ? (
              <p className="text-xl text-slate-500 dark:text-slate-400">
                No recent past events.
              </p>
            ) : (
              recentPastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border px-5 py-4 opacity-85"
                  style={getEventChipStyle(event.categoryColor)}
                >
                  <p className="text-2xl font-medium">
                    {event.title}
                  </p>

                  <p className="mt-1 text-lg opacity-80">
                    {event.allDay
                      ? format(event.startAt, "MMM d")
                      : format(event.startAt, "MMM d · HH:mm")}
                  </p>
                </div>
              ))
            )}
          </div>
        </WallCard>
      </div>

      <WallCard
        title="Pinned note"
        icon={Pin}
        iconTone="amber"
        variant="note"
      >
        {pinnedNote ? (
          <>
            <p className="text-2xl font-medium">
              {pinnedNote.title}
            </p>

            <p className="mt-3 whitespace-pre-wrap text-xl leading-relaxed">
              {pinnedNote.content}
            </p>
          </>
        ) : (
          <p className="text-xl">
            No pinned note.
          </p>
        )}
      </WallCard>
    </div>
  );
}