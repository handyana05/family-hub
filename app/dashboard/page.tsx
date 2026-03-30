import Link from "next/link";
import { format } from "date-fns";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard-service";
import { AppShell } from "@/components/app-shell";

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
    <AppShell title="Dashboard" subtitle="What matters now for your household.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today’s events</h2>
            <Link href="/calendar" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Open
            </Link>
          </div>
          {data.todaysEvents.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No events today.</p>
          ) : (
            <div className="space-y-3">
              {data.todaysEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {event.allDay ? "All day" : format(event.startAt, "EEE, MMM d · HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Open todos</h2>
            <Link href="/todos" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Open
            </Link>
          </div>
          {data.openTodos.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No open todos.</p>
          ) : (
            <div className="space-y-3">
              {data.openTodos.map((todo) => (
                <div key={todo.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{todo.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {todo.dueAt ? `Due ${format(todo.dueAt, "EEE, MMM d · HH:mm")}` : "No due date"}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClass(todo.priority)}`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Shopping</h2>
            <Link href="/shopping" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Open
            </Link>
          </div>
          {data.activeShoppingItems.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Shopping list is clear.</p>
          ) : (
            <div className="space-y-3">
              {data.activeShoppingItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="font-medium">{item.name}</p>
                  {item.quantity ? <p className="text-sm text-slate-500 dark:text-slate-400">{item.quantity}</p> : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <h2 className="text-lg font-semibold">Pinned family note</h2>
          {data.pinnedNote ? (
            <div className="mt-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-800">
              <h3 className="font-medium text-amber-950 dark:text-amber-200">{data.pinnedNote.title}</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-amber-900 dark:text-amber-300">
                {data.pinnedNote.content}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No pinned note.</p>
          )}
        </section>
      </div>

      {data.overdueTodos.length > 0 ? (
        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">Overdue todos</h2>
          <div className="mt-3 space-y-2">
            {data.overdueTodos.map((todo) => (
              <div key={todo.id} className="rounded-lg border border-red-200 bg-white p-3 dark:border-red-900 dark:bg-slate-900">
                <p className="font-medium">{todo.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {todo.dueAt ? `Was due ${format(todo.dueAt, "EEE, MMM d · HH:mm")}` : "No due date"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}