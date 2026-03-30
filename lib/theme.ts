import { cookies } from "next/headers";

export type ThemeMode = "light" | "dark" | "system";

const THEME_COOKIE = "familyhub_theme";

export async function getTheme(): Promise<ThemeMode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;

  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return "system";
}

export async function setTheme(theme: ThemeMode) {
  const cookieStore = await cookies();

  cookieStore.set(THEME_COOKIE, theme, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function resolveServerTheme(theme: ThemeMode): "light" | "dark" {
  if (theme === "light") return "light";
  if (theme === "dark") return "dark";
  return "dark";
}