import Link from "next/link";
import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard-service";

function priorityClass(priority: "LOW" | "MEDIUM" | "HIGH") {
  if (priority === "HIGH") {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  }

  if (priority === "MEDIUM") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default async function DashboardPage() {
  const session = await requireUser();
  const data = await getDashboardData(session.householdId);

  return (
    <AppShell title="Dashboard" subtitle="What matters now for your household">
      <PageHeader
        title="Dashboard"
        subtitle="Today’s essentials, optimized for quick phone checks."
      />

      <div className="space-y-6">
        <SectionCard
          title="Today’s events"
          subtitle={
            data.todaysEvents.length === 0
              ? "Nothing scheduled for today"
              : `${data.todaysEvents.length} event${data.todaysEvents.length === 1 ? "" : "s"} today`
          }
          actions={
            <Link
              href="/calendar"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Open calendar
            </Link>
          }
        >
          {data.todaysEvents.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No events today.
            </p>
          ) : (
            <div className="space-y-3">
              {data.todaysEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {event.allDay
                      ? "All day"
                      : format(event.startAt, "EEE, MMM d · HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {data.overdueTodos.length > 0 ? (
          <SectionCard
            title="Overdue todos"
            subtitle={`${data.overdueTodos.length} overdue item${data.overdueTodos.length === 1 ? "" : "s"}`}
            className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          >
            <div className="space-y-3">
              {data.overdueTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="rounded-2xl border border-red-200 bg-white p-4 dark:border-red-900 dark:bg-slate-900"
                >
                  <p className="text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                    {todo.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {todo.dueAt
                      ? `Was due ${format(todo.dueAt, "EEE, MMM d · HH:mm")}`
                      : "No due date"}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Open todos"
            subtitle={`${data.openTodos.length} open item${data.openTodos.length === 1 ? "" : "s"}`}
            actions={
              <Link
                href="/todos"
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Open todos
              </Link>
            }
          >
            {data.openTodos.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No open todos.
              </p>
            ) : (
              <div className="space-y-3">
                {data.openTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                          {todo.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {todo.dueAt
                            ? `Due ${format(todo.dueAt, "EEE, MMM d · HH:mm")}`
                            : "No due date"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClass(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Shopping"
            subtitle={`${data.activeShoppingItems.length} active item${data.activeShoppingItems.length === 1 ? "" : "s"}`}
            actions={
              <Link
                href="/shopping"
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Open shopping
              </Link>
            }
          >
            {data.activeShoppingItems.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Shopping list is clear.
              </p>
            ) : (
              <div className="space-y-3">
                {data.activeShoppingItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className="text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                      {item.name}
                    </p>
                    {item.quantity ? (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.quantity}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Pinned family note">
          {data.pinnedNote ? (
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-800">
              <h3 className="text-base font-medium text-amber-950 dark:text-amber-200 sm:text-lg">
                {data.pinnedNote.title}
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-amber-900 dark:text-amber-300 sm:text-base">
                {data.pinnedNote.content}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No pinned note.
            </p>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}