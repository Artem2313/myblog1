"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/dal";
import { changeUserRole, removeUser } from "@/services/user-service";
import type { Role } from "@/lib/generated/prisma/enums";

export async function changeUserRoleAction(
  userId: number,
  role: Role,
): Promise<void> {
  const session = await requireSession();

  const result = await changeUserRole(userId, role, session);
  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin");
}

export async function deleteUserAction(userId: number): Promise<void> {
  const session = await requireSession();

  const result = await removeUser(userId, session);
  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin");
  revalidatePath("/posts", "layout");
}
