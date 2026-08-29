import Link from "next/link";

import { logoutAction } from "@/app/login/actions";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";
import type { ThemeMode } from "@/lib/theme";

type AppShellProps = {
  familyName: string;
  currentTheme: ThemeMode;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/shopping", label: "Shopping" },
  { href: "/todos", label: "Todos" },
  { href: "/settings", label: "Settings" },
  { href: "/wall", label: "Wall" },
];

export function AppShell({
  familyName,
  currentTheme,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Mobile header */}
          <div className="flex items-center justify-between gap-4 md:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src="/icons/icon-192.png"
                alt="Family Hub"
                className="h-8 w-8 shrink-0"
              />

              <h1 className="truncate text-xl font-semibold">
                Family Hub
                <span className="text-slate-400 dark:text-slate-500">
                  {" "}–{" "}
                </span>
                {familyName} Family
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggleIcon currentTheme={currentTheme} />
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden items-center justify-between gap-8 md:flex">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/icons/icon-192.png"
                alt="Family Hub"
                className="h-10 w-10 shrink-0"
              />

              <h1 className="truncate text-2xl font-semibold">
                Family Hub
                <span className="text-slate-400 dark:text-slate-500">
                  {" "}–{" "}
                </span>
                {familyName} Family
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <ThemeToggleIcon currentTheme={currentTheme} />

              <form action={logoutAction}>
                <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}