import { AppShell } from "@/components/app-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTheme } from "@/lib/theme";

export default async function SettingsPage() {
  const session = await requireUser();
  const currentTheme = await getTheme();

  const [household, users, categories] = await Promise.all([
    db.household.findUnique({ where: { id: session.householdId } }),
    db.user.findMany({
      where: { householdId: session.householdId },
      orderBy: { name: "asc" },
    }),
    db.category.findMany({
      where: { householdId: session.householdId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <AppShell title="Settings" subtitle="Starter settings overview.">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Choose how Family Hub should look across app and wall pages.
          </p>
          <div className="mt-4">
            <ThemeToggle currentTheme={currentTheme} />
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Household</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {household?.name ?? "Unknown household"}
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Users</h2>
          <div className="mt-3 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="rounded-lg border p-3 dark:border-slate-700">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.email ?? "No email"} · {user.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-lg border p-3 dark:border-slate-700">
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{category.type}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}