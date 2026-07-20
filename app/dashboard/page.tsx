import type { Metadata } from "next";
import Link from "next/link";
import DeletePostButton from "@/components/posts/DeletePostButton";
import { getCurrentUser, requireSession } from "@/lib/auth/dal";
import { findPostsByAuthor } from "@/repositories/post-repository";

export const metadata: Metadata = {
  title: "Dashboard",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function DashboardPage() {
  const session = await requireSession();
  const [user, posts] = await Promise.all([
    getCurrentUser(),
    findPostsByAuthor(session.userId),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Logged in as {user?.name} ({user?.email})
          </p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Write a post
        </Link>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Your posts ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          You have not written any posts yet.{" "}
          <Link href="/posts/new" className="font-medium text-gray-900 hover:underline">
            Write your first one.
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {post.published ? (
                    <Link
                      href={`/posts/${post.slug}`}
                      className="truncate font-medium text-gray-900 hover:underline"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    <span className="truncate font-medium text-gray-900">
                      {post.title}
                    </span>
                  )}
                  {!post.published && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Updated {dateFormatter.format(post.updatedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/posts/${post.slug}/edit`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
