"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DeletePostButton from "@/components/posts/DeletePostButton";
import type { SessionUser } from "@/types/session";

/**
 * Edit/Delete controls on the (ISR-cached) post detail page. The page itself
 * cannot read the session cookie without losing static rendering, so this
 * client component asks /api/auth/me. Authorization is still enforced
 * server-side inside the Server Actions.
 */
export default function OwnerActions({
  postId,
  postSlug,
  authorId,
}: {
  postId: number;
  postSlug: string;
  authorId: number;
}) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data: { user: SessionUser | null }) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user || (user.id !== authorId && user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-4">
      <Link
        href={`/posts/${postSlug}/edit`}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
      >
        Edit
      </Link>
      <DeletePostButton postId={postId} redirectTo="/posts" />
    </div>
  );
}
