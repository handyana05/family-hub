import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "familyhub_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
  userId: string;
  householdId: string;
  role: "ADMIN" | "MEMBER";
  name: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());

    return {
      userId: String(payload.userId),
      householdId: String(payload.householdId),
      role: payload.role === "ADMIN" ? "ADMIN" : "MEMBER",
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}
