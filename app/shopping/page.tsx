import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  addShoppingItemAction,
  completeShoppingItemAction,
  reopenShoppingItemAction,
  deleteShoppingItemAction,
} from "./actions";

export default async function ShoppingPage() {
  const session = await requireUser();

  const [items, categories] = await Promise.all([
    db.shoppingItem.findMany({
      where: { householdId: session.householdId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { category: true },
    }),
    db.category.findMany({
      where: { householdId: session.householdId, type: "SHOPPING" },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AppShell title="Shopping" subtitle="Fast shared list for the household.">
      <form action={addShoppingItemAction} className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <input
          name="name"
          placeholder="Add milk, apples, detergent..."
          className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          required
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="quantity"
            placeholder="Quantity (optional)"
            className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <select name="categoryId" className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          rows={3}
        />
        <div>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Add item
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <p className="font-medium">{item.name}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
                {item.quantity ? <span>{item.quantity}</span> : null}
                {item.category?.name ? <span>· {item.category.name}</span> : null}
                {item.status === "DONE" ? <span>· done</span> : null}
              </div>
            </div>

            <div className="flex gap-2">
              {item.status === "ACTIVE" ? (
                <form action={completeShoppingItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button className="rounded bg-green-600 px-3 py-2 text-sm text-white">Done</button>
                </form>
              ) : (
                <form action={reopenShoppingItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button className="rounded bg-amber-600 px-3 py-2 text-sm text-white">Reopen</button>
                </form>
              )}
              <form action={deleteShoppingItemAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button className="rounded bg-red-600 px-3 py-2 text-sm text-white">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}