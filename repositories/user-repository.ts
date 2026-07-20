import "server-only";

import prisma from "@/lib/prisma";
import type { Role } from "@/lib/generated/prisma/enums";

/** User fields that are safe to pass to the UI (no password hash). */
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
};

export function findUserById(id: number): Promise<SafeUser | null> {
  return prisma.user.findUnique({ where: { id }, select: safeUserSelect });
}

/** Includes the password hash — only for credential verification. */
export function findUserWithPasswordByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<SafeUser> {
  return prisma.user.create({ data, select: safeUserSelect });
}

export function listUsers(): Promise<(SafeUser & { postCount: number })[]> {
  return prisma.user
    .findMany({
      select: { ...safeUserSelect, _count: { select: { posts: true } } },
      orderBy: { createdAt: "asc" },
    })
    .then((users) =>
      users.map(({ _count, ...user }) => ({ ...user, postCount: _count.posts })),
    );
}

export function updateUserRole(id: number, role: Role): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: safeUserSelect,
  });
}

export function deleteUser(id: number): Promise<void> {
  return prisma.user.delete({ where: { id } }).then(() => undefined);
}

export function countUsers(): Promise<number> {
  return prisma.user.count();
}
