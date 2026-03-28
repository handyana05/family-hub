import { format } from "date-fns";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/services/dashboard-service";

export const revalidate = 60;

export default async function WallPage() {
  const session = await requireUser();
  const data = await getDashboardData(session.householdId);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <header className="mb-8 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight">Family Hub</h1>
            <p className="mt-3 text-2xl text-slate-300">
              {format(data.now, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-semibold tabular-nums">
              {format(data.now, "HH:mm")}
            </div>
            <p className="mt-2 text-xl text-slate-400">Wall mode</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="mb-4 text-3xl font-semibold">Today</h2>
            {data.todaysEvents.length === 0 ? (
              <p className="text-xl text-slate-400">No events today.</p>
            ) : (
              <div className="space-y-3">
                {data.todaysEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-white/5 px-5 py-4">
                    <p className="text-2xl font-medium">{event.title}</p>
                    <p className="mt-1 text-lg text-slate-300">
                      {event.allDay ? "All day" : format(event.startAt, "HH:mm")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="mb-4 text-3xl font-semibold">Todos</h2>
            {data.openTodos.length === 0 ? (
              <p className="text-xl text-slate-400">All clear.</p>
            ) : (
              <div className="space-y-3">
                {data.openTodos.slice(0, 6).map((todo) => (
                  <div key={todo.id} className="rounded-2xl bg-white/5 px-5 py-4">
                    <p className="text-2xl font-medium">{todo.title}</p>
                    {todo.dueAt ? (
                      <p className="mt-1 text-lg text-slate-300">
                        Due {format(todo.dueAt, "MMM d · HH:mm")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="mb-4 text-3xl font-semibold">Shopping</h2>
            {data.activeShoppingItems.length === 0 ? (
              <p className="text-xl text-slate-400">Nothing to buy.</p>
            ) : (
              <div className="space-y-3">
                {data.activeShoppingItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white/5 px-5 py-4">
                    <p className="text-2xl font-medium">{item.name}</p>
                    {item.quantity ? <p className="mt-1 text-lg text-slate-300">{item.quantity}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-amber-300 p-6 text-slate-950">
            <h2 className="mb-3 text-3xl font-semibold">Pinned note</h2>
            {data.pinnedNote ? (
              <>
                <p className="text-2xl font-medium">{data.pinnedNote.title}</p>
                <p className="mt-3 whitespace-pre-wrap text-xl leading-relaxed">
                  {data.pinnedNote.content}
                </p>
              </>
            ) : (
              <p className="text-xl">No pinned note.</p>
            )}
          </section>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: "setTimeout(() => window.location.reload(), 60000);",
        }}
      />
    </main>
  );
}
