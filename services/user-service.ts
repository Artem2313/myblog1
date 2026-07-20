import "server-only";

import type { SessionPayload } from "@/lib/auth/session";
import type { Role } from "@/lib/generated/prisma/enums";
import * as userRepository from "@/repositories/user-repository";

export type UserActionResult = { ok: true } | { ok: false; error: string };

export async function changeUserRole(
  targetUserId: number,
  role: Role,
  session: SessionPayload,
): Promise<UserActionResult> {
  if (session.role !== "ADMIN") {
    return { ok: false, error: "Only admins can change roles." };
  }
  if (targetUserId === session.userId) {
    return { ok: false, error: "You cannot change your own role." };
  }

  await userRepository.updateUserRole(targetUserId, role);
  return { ok: true };
}

export async function removeUser(
  targetUserId: number,
  session: SessionPayload,
): Promise<UserActionResult> {
  if (session.role !== "ADMIN") {
    return { ok: false, error: "Only admins can delete users." };
  }
  if (targetUserId === session.userId) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  await userRepository.deleteUser(targetUserId);
  return { ok: true };
}
