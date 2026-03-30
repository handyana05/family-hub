"use client";

import { useEffect, useTransition } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { setThemeAction } from "@/app/settings/actions";
import type { ThemeMode } from "@/lib/theme";

type ThemeToggleProps = {
  currentTheme: ThemeMode;
};

export function ThemeToggle({ currentTheme }: ThemeToggleProps) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const html = document.documentElement;

    if (currentTheme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
      return;
    }

    if (currentTheme === "dark") {
      html.classList.remove("light");
      html.classList.add("dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.classList.remove("light", "dark");
    html.classList.add(prefersDark ? "dark" : "light");
  }, [currentTheme]);

  function submitTheme(theme: ThemeMode) {
    const formData = new FormData();
    formData.set("theme", theme);

    startTransition(() => {
      void setThemeAction(formData);
    });

    const html = document.documentElement;

    if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else if (theme === "dark") {
      html.classList.remove("light");
      html.classList.add("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.remove("light", "dark");
      html.classList.add(prefersDark ? "dark" : "light");
    }
  }

  const options: Array<{
    value: ThemeMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const active = currentTheme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => submitTheme(option.value)}
            disabled={isPending}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            }`}
            aria-pressed={active}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}