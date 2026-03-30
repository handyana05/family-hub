import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { getTheme } from "@/lib/theme";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export async function AppShell({ title, subtitle, children }: AppShellProps) {
  const currentTheme = await getTheme();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
            ) : null}
          </div>

          <nav className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Dashboard
            </Link>
            <Link href="/calendar" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Calendar
            </Link>
            <Link href="/shopping" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Shopping
            </Link>
            <Link href="/todos" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Todos
            </Link>
            <Link href="/settings" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Settings
            </Link>
            <Link href="/wall" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
              Wall
            </Link>

            <ThemeToggleIcon currentTheme={currentTheme} />

            <form action={logoutAction}>
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </main>
  );
}