import "server-only";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, createSession, getSession } from "@/lib/session";

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function loginWithPassword(email: string, password: string) {
  const user = await db.user.findFirst({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      householdId: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user || !user.passwordHash) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  await createSession({
    userId: user.id,
    householdId: user.householdId,
    role: user.role,
    name: user.name,
  });

  return { ok: true as const };
}

export async function logout() {
  await clearSession();
}
