"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/actions/auth-actions";
import type { SessionUser } from "@/types/session";

type MenuState =
  | { status: "loading" }
  | { status: "ready"; user: SessionUser | null };

export default function UserMenu() {
  const [state, setState] = useState<MenuState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: SessionUser | null }) => {
        if (!cancelled) setState({ status: "ready", user: data.user });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "ready", user: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <div className="h-8 w-32" aria-hidden />;
  }

  if (!state.user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/login" className="text-gray-600 hover:text-gray-900">
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-700"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {state.user.role === "ADMIN" && (
        <Link href="/admin" className="text-gray-600 hover:text-gray-900">
          Admin
        </Link>
      )}
      <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
        Dashboard
      </Link>
      <Link
        href={`/profile/${state.user.id}`}
        className="font-medium text-gray-900 hover:underline"
      >
        {state.user.name}
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-600 hover:bg-gray-100"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
