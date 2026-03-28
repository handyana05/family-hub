import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  addTodoAction,
  completeTodoAction,
  reopenTodoAction,
  deleteTodoAction,
} from "./actions";

export default async function TodosPage() {
  const session = await requireUser();

  const [todos, categories, users] = await Promise.all([
    db.todoItem.findMany({
      where: { householdId: session.householdId },
      orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
      include: { assignedTo: true, category: true },
    }),
    db.category.findMany({
      where: { householdId: session.householdId, type: "TODO" },
      orderBy: { name: "asc" },
    }),
    db.user.findMany({
      where: { householdId: session.householdId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <AppShell title="Todos" subtitle="Shared tasks for the family.">
      <form action={addTodoAction} className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm">
        <input
          name="title"
          placeholder="What needs to be done?"
          className="rounded-lg border px-3 py-2"
          required
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          className="rounded-lg border px-3 py-2"
          rows={3}
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <select name="priority" className="rounded-lg border px-3 py-2" defaultValue="MEDIUM">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <input name="dueAt" type="datetime-local" className="rounded-lg border px-3 py-2" />

          <select name="categoryId" className="rounded-lg border px-3 py-2">
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select name="assignedToId" className="rounded-lg border px-3 py-2">
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Add todo
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
            <div>
              <p className="font-medium">{todo.title}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                <span>{todo.assignedTo ? `Assigned to ${todo.assignedTo.name}` : "Unassigned"}</span>
                {todo.category?.name ? <span>· {todo.category.name}</span> : null}
                {todo.dueAt ? <span>· Due {format(todo.dueAt, "EEE, MMM d · HH:mm")}</span> : null}
                <span>· {todo.priority}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {todo.status === "OPEN" ? (
                <form action={completeTodoAction}>
                  <input type="hidden" name="todoId" value={todo.id} />
                  <button className="rounded bg-green-600 px-3 py-2 text-sm text-white">Done</button>
                </form>
              ) : (
                <form action={reopenTodoAction}>
                  <input type="hidden" name="todoId" value={todo.id} />
                  <button className="rounded bg-amber-600 px-3 py-2 text-sm text-white">Reopen</button>
                </form>
              )}

              <form action={deleteTodoAction}>
                <input type="hidden" name="todoId" value={todo.id} />
                <button className="rounded bg-red-600 px-3 py-2 text-sm text-white">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
