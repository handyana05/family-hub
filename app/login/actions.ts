"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { loginWithPassword, logout } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error("Please enter a valid email and password.");
  }

  const result = await loginWithPassword(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    throw new Error(result.error);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
