"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useTransition } from "react";
import { setThemeAction } from "@/app/settings/actions";
import type { ThemeMode } from "@/lib/theme";

type ThemeToggleIconProps = {
  currentTheme: ThemeMode;
};

export function ThemeToggleIcon({ currentTheme }: ThemeToggleIconProps) {
  const [isPending, startTransition] = useTransition();

  const resolvedTheme: "light" | "dark" =
    currentTheme === "light" ? "light" : currentTheme === "dark" ? "dark" : "dark";

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

  function toggleTheme() {
    const nextTheme: ThemeMode = resolvedTheme === "dark" ? "light" : "dark";

    const formData = new FormData();
    formData.set("theme", nextTheme);

    startTransition(() => {
      void setThemeAction(formData);
    });

    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(nextTheme);
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isPending}
      className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}