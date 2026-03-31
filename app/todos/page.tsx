import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { CollapsibleSection } from "@/components/collapsible-section";
import {
  completeTodoAction,
  addTodoAction,
  deleteTodoAction,
  reopenTodoAction,
} from "./actions";
import {
  listDoneTodos,
  listOpenTodos,
  listOverdueTodos,
  type TodoItemDto,
} from "@/lib/services/todo-service";
import { requireUser } from "@/lib/auth";
import { ActionButton } from "@/components/action-button";

export default async function TodosPage() {
  const session = await requireUser();

  const [openTodos, doneTodos, overdueTodos] = await Promise.all([
    listOpenTodos(session.householdId),
    listDoneTodos(session.householdId),
    listOverdueTodos(session.householdId),
  ]);

  return (
    <AppShell title="Todos" subtitle="Fast family task management">
      <PageHeader
        title="Todo list"
        subtitle="One tap to complete, quick enough for everyday use."
      />

      <div className="space-y-6">
        <SectionCard
          title="Quick add"
          subtitle="Capture tasks before you forget them"
          className="sticky top-3 z-20"
        >
          <form action={addTodoAction} className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Add a todo…"
              required
              autoFocus
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="datetime-local"
                name="dueAt"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />

              <ActionButton icon="plus" className="w-full justify-center py-3.5 sm:w-auto">
                Add
              </ActionButton>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Overdue"
          subtitle={`${overdueTodos.length} overdue item${overdueTodos.length === 1 ? "" : "s"}`}
        >
          {overdueTodos.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No overdue todos.
            </p>
          ) : (
            <div className="space-y-3">
              {overdueTodos.map((todo: TodoItemDto) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 dark:border-red-400/20 dark:bg-red-500/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-red-800 dark:text-red-100 sm:text-lg">
                      {todo.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-red-700 dark:text-red-200/80">
                      {todo.dueAt ? (
                        <span>
                          Due{" "}
                          {new Date(todo.dueAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                      {todo.priority ? <span>{todo.priority}</span> : null}
                    </div>
                  </div>

                  <form action={completeTodoAction}>
                    <input type="hidden" name="todoId" value={todo.id} />
                    <ActionButton
                      variant="success"
                      icon="done"
                      iconOnly
                      ariaLabel="Complete todo"
                      title="Complete todo"
                      className="min-h-11 min-w-11"
                    />
                  </form>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Open todos"
          subtitle={`${openTodos.length} open item${openTodos.length === 1 ? "" : "s"}`}
        >
          {openTodos.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Nothing open right now.
            </p>
          ) : (
            <div className="space-y-3">
              {openTodos.map((todo: TodoItemDto) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-slate-950 dark:text-slate-100 sm:text-lg">
                      {todo.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                      {todo.dueAt ? (
                        <span>
                          Due{" "}
                          {new Date(todo.dueAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                      {todo.priority ? <span>{todo.priority}</span> : null}
                      {todo.assignedTo?.name ? <span>{todo.assignedTo.name}</span> : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={completeTodoAction}>
                      <input type="hidden" name="todoId" value={todo.id} />
                      <ActionButton
                        variant="success"
                        icon="done"
                        iconOnly
                        ariaLabel="Complete todo"
                        title="Complete todo"
                        className="min-h-11 min-w-11"
                      />
                    </form>

                    <form action={deleteTodoAction}>
                      <input type="hidden" name="todoId" value={todo.id} />
                      <ActionButton
                        variant="ghost"
                        icon="delete"
                        iconOnly
                        ariaLabel="Delete todo"
                        title="Delete todo"
                        className="min-h-11 min-w-11"
                      />
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <CollapsibleSection
          title="Completed"
          subtitle={`${doneTodos.length} completed item${doneTodos.length === 1 ? "" : "s"}`}
          defaultOpen={false}
        >
          {doneTodos.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No completed todos yet.
            </p>
          ) : (
            <div className="space-y-3">
              {doneTodos.map((todo: TodoItemDto) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-4 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-emerald-800 dark:text-emerald-100 sm:text-lg">
                      {todo.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-emerald-700 dark:text-emerald-200/80">
                      {todo.completedAt ? (
                        <span>
                          Done{" "}
                          {new Date(todo.completedAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <form action={reopenTodoAction}>
                    <input type="hidden" name="todoId" value={todo.id} />
                    <ActionButton
                      variant="wall-reopen"
                      icon="reopen"
                      iconOnly
                      ariaLabel="Reopen todo"
                      title="Reopen todo"
                      className="min-h-11 min-w-11"
                    />
                  </form>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>
      </div>
    </AppShell>
  );
}