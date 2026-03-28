import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Dashboard</Link>
            <Link href="/calendar" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Calendar</Link>
            <Link href="/shopping" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Shopping</Link>
            <Link href="/todos" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Todos</Link>
            <Link href="/settings" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</Link>
            <Link href="/wall" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Wall</Link>
            <form action={logoutAction}>
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </div>
    </main>
  );
}
