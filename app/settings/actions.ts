"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { setTheme, type ThemeMode } from "@/lib/theme";

const themeSchema = z.enum(["light", "dark", "system"]);

export async function setThemeAction(formData: FormData) {
  const parsed = themeSchema.safeParse(formData.get("theme"));

  if (!parsed.success) return;

  await setTheme(parsed.data as ThemeMode);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/shopping");
  revalidatePath("/todos");
  revalidatePath("/settings");
  revalidatePath("/wall");
}