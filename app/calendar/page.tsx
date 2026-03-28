import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function CalendarPage() {
  const session = await requireUser();

  const events = await db.calendarEvent.findMany({
    where: { householdId: session.householdId },
    orderBy: [{ startAt: "asc" }],
    include: { category: true, assignedTo: true },
    take: 20,
  });

  return (
    <AppShell title="Calendar" subtitle="Starter page with upcoming events list.">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">No events yet.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border p-4">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-slate-500">
                  {event.allDay ? format(event.startAt, "EEE, MMM d") + " · All day" : format(event.startAt, "EEE, MMM d · HH:mm")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
