import Link from "next/link";
import { logoutAction } from "@/app/login/actions";
import { getTheme } from "@/lib/theme";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";
import { MobileNav } from "@/components/mobile-nav";

type AppShellProps = {
  title: string;
  subtitle?: string;
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

export async function AppShell({ title, subtitle, children }: AppShellProps) {
  const currentTheme = await getTheme();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          {/* Mobile header */}
          <div className="flex items-start justify-between gap-4 md:hidden">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggleIcon currentTheme={currentTheme} />
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden items-center justify-between gap-6 md:flex">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <ThemeToggleIcon currentTheme={currentTheme} />

              <form action={logoutAction}>
                <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">{children}</div>

      <MobileNav />
    </main>
  );
}