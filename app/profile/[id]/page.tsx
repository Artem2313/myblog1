import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPostsByAuthor } from "@/repositories/post-repository";
import { findUserById } from "@/repositories/user-repository";

// Profiles always show fresh data, so this route renders per request.
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await findUserById(Number(id));
  return { title: user ? `${user.name}'s profile` : "Profile" };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId < 1) {
    notFound();
  }

  const user = await findUserById(userId);
  if (!user) {
    notFound();
  }

  const posts = await findPostsByAuthor(userId, { publishedOnly: true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {user.role === "ADMIN" ? "Administrator" : "Member"} · joined{" "}
          {dateFormatter.format(user.createdAt)}
        </p>
      </div>

      <h2 className="mt-10 mb-4 text-xl font-semibold text-gray-900">
        Published posts ({posts.length})
      </h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No published posts yet.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg bg-white p-4 shadow-sm">
              <Link
                href={`/posts/${post.slug}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                {dateFormatter.format(post.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
