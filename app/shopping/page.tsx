import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import {
  addShoppingItemAction,
  completeShoppingItemAction,
  deleteShoppingItemAction,
  reopenShoppingItemAction,
} from "./actions";
import {
  listActiveItems,
  listCompletedItems,
  type ShoppingItemDto,
} from "@/lib/services/shopping-service";
import { requireUser } from "@/lib/auth";
import { ActionButton } from "@/components/action-button";

export default async function ShoppingPage() {
  const session = await requireUser();

  const [activeItems, completedItems] = await Promise.all([
    listActiveItems(session.householdId),
    listCompletedItems(session.householdId),
  ]);

  return (
    <AppShell title="Shopping" subtitle="Fast family shopping list">
      <PageHeader
        title="Shopping list"
        subtitle="Add quickly, tap once to complete."
      />

      <div className="space-y-6">
        <SectionCard title="Quick add" subtitle="Designed for fast phone entry">
          <form action={addShoppingItemAction} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1.5fr_0.8fr_auto]">
              <input
                type="text"
                name="name"
                placeholder="Add an item…"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />

              <input
                type="text"
                name="quantity"
                placeholder="Qty (optional)"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />

              <ActionButton icon="plus" className="w-full justify-center py-3 sm:w-auto">
                Add
              </ActionButton>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Active items"
          subtitle={`${activeItems.length} item${activeItems.length === 1 ? "" : "s"} to buy`}
        >
          {activeItems.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Nothing to buy right now.
            </p>
          ) : (
            <div className="space-y-3">
              {activeItems.map((item: ShoppingItemDto) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                      {item.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.quantity ? <span>{item.quantity}</span> : null}
                      {item.category?.name ? <span>{item.category.name}</span> : null}
                      {item.notes ? <span className="truncate">{item.notes}</span> : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={completeShoppingItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <ActionButton
                        variant="success"
                        icon="done"
                        iconOnly
                        ariaLabel="Mark done"
                        title="Mark done"
                      />
                    </form>

                    <form action={deleteShoppingItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <ActionButton
                        variant="ghost"
                        icon="delete"
                        iconOnly
                        ariaLabel="Delete item"
                        title="Delete item"
                      />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Completed"
          subtitle="Tap to reopen if needed"
        >
          {completedItems.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No completed items yet.
            </p>
          ) : (
            <div className="space-y-3">
              {completedItems.map((item: ShoppingItemDto) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-4 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-emerald-800 dark:text-emerald-100 sm:text-lg">
                      {item.name}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-emerald-700 dark:text-emerald-200/80">
                      {item.quantity ? <span>{item.quantity}</span> : null}
                      {item.completedAt ? (
                        <span>
                          Done{" "}
                          {new Date(item.completedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <form action={reopenShoppingItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <ActionButton
                      variant="wall-reopen"
                      icon="reopen"
                      iconOnly
                      ariaLabel="Reopen item"
                      title="Reopen item"
                    />
                  </form>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}