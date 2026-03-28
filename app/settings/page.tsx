import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await requireUser();

  const [household, users, categories] = await Promise.all([
    db.household.findUnique({ where: { id: session.householdId } }),
    db.user.findMany({ where: { householdId: session.householdId }, orderBy: { name: "asc" } }),
    db.category.findMany({ where: { householdId: session.householdId }, orderBy: [{ type: "asc" }, { name: "asc" }] }),
  ]);

  return (
    <AppShell title="Settings" subtitle="Starter settings overview.">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Household</h2>
          <p className="mt-2 text-sm text-slate-600">{household?.name ?? "Unknown household"}</p>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="mt-3 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="rounded-lg border p-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email ?? "No email"} · {user.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="rounded-lg border p-3">
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-slate-500">{category.type}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
