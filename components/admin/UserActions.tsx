"use client";

import { useTransition } from "react";
import {
  changeUserRoleAction,
  deleteUserAction,
} from "@/actions/user-actions";
import type { Role } from "@/lib/generated/prisma/enums";

export default function UserActions({
  userId,
  role,
  isSelf,
}: {
  userId: number;
  role: Role;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-xs text-gray-400">(you)</span>;
  }

  const nextRole: Role = role === "ADMIN" ? "USER" : "ADMIN";

  function handleRoleChange() {
    startTransition(async () => {
      await changeUserRoleAction(userId, nextRole);
    });
  }

  function handleDelete() {
    if (!confirm("Delete this user and all of their posts?")) return;
    startTransition(async () => {
      await deleteUserAction(userId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleRoleChange}
        disabled={pending}
        className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        {role === "ADMIN" ? "Make user" : "Make admin"}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
