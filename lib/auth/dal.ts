import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import {
  decryptSession,
  readSessionCookie,
  type SessionPayload,
} from "@/lib/auth/session";
import { findUserById, type SafeUser } from "@/repositories/user-repository";

/** Returns the decoded session, or null when the visitor is not logged in. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return decryptSession(await readSessionCookie());
});

/** Returns the logged-in user's database record (without password), or null. */
export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const session = await getSession();
  if (!session) return null;
  return findUserById(session.userId);
});

/** Redirects to /login unless a valid session exists. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Redirects unless the logged-in user is an admin. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "ADMIN") redirect("/dashboard");
  return session;
}
