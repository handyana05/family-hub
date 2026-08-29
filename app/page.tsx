import Link from "next/link";
import {
  CalendarDays,
  CheckSquare,
  Monitor,
  NotebookText,
  ShoppingCart,
  ShieldCheck,
} from "lucide-react";

import { getSession } from "@/lib/session";
import { getTheme } from "@/lib/theme";
import { ThemeToggleIcon } from "@/components/theme-toggle-icon";

const features = [
  {
    title: "Calendar",
    description: "Keep everyone's schedule in one place.",
    icon: CalendarDays,
    iconClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  {
    title: "Todos",
    description: "Create tasks and keep the family organized.",
    icon: CheckSquare,
    iconClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    title: "Shopping",
    description: "Build your shared shopping list together.",
    icon: ShoppingCart,
    iconClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    title: "Notes",
    description: "Keep important family notes close at hand.",
    icon: NotebookText,
    iconClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
];

export default async function HomePage() {
  const currentTheme = await getTheme();
  const session = await getSession();
  const isLoggedIn = Boolean(session);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xl">♡</span>
            </div>

            <span className="text-lg sm:text-xl">
              Family Hub
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggleIcon currentTheme={currentTheme} />

            {isLoggedIn && (
              <Link
                href="/wall"
                className="hidden min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white sm:inline-flex"
              >
                <Monitor className="h-4 w-4" />
                Wall Display
              </Link>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="max-w-xl">
            {isLoggedIn && (
              <div className="mb-5 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300">
                Welcome back 👋
              </div>
            )}

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Everything your family needs,
              <span className="block text-violet-600 dark:text-violet-400">
                in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Stay organized together with shared calendars, todos,
              shopping lists and family notes.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  Open Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-violet-500 dark:hover:bg-violet-400"
                >
                  Login
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  href="/wall"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Monitor className="h-4 w-4" />
                  Wall Display
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Private family space</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-violet-200/70 via-transparent to-sky-200/70 blur-2xl dark:from-violet-900/30 dark:to-sky-900/20" />

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Good morning
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Family 👋
                  </h2>
                </div>

                <div className="h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-950" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <PreviewCard
                  title="Today"
                  className="sm:row-span-2"
                >
                  <PreviewRow
                    title="School"
                    meta="08:00"
                  />
                  <PreviewRow
                    title="Piano lesson"
                    meta="16:30"
                  />
                  <PreviewRow
                    title="Family dinner"
                    meta="19:00"
                  />
                </PreviewCard>

                <PreviewCard title="Todos">
                  <PreviewCheck text="Buy milk" />
                  <PreviewCheck text="Prepare school bags" />
                  <PreviewCheck text="Clean the living room" />
                </PreviewCard>

                <PreviewCard title="Shopping">
                  <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                    <p>Milk</p>
                    <p>Eggs</p>
                    <p>Apples</p>
                  </div>
                </PreviewCard>
              </div>

              <PreviewCard
                title="Family note"
                className="mt-3"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Don't forget the doctor appointment next Monday.
                </p>
              </PreviewCard>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="pb-10">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">
              Everything in one family hub
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Family Hub · Built for your family
        </footer>
      </div>
    </main>
  );
}

function PreviewCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 ${className}`}
    >
      <p className="mb-3 text-sm font-semibold">
        {title}
      </p>

      {children}
    </div>
  );
}

function PreviewRow({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-2 last:border-b-0 dark:border-slate-800">
      <span className="text-sm">
        {title}
      </span>

      <span className="text-xs text-slate-500 dark:text-slate-400">
        {meta}
      </span>
    </div>
  );
}

function PreviewCheck({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 text-sm text-slate-600 dark:text-slate-300">
      <span className="h-4 w-4 rounded border border-slate-300 dark:border-slate-700" />
      {text}
    </div>
  );
}