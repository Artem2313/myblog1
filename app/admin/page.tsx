import type { Metadata } from "next";
import Link from "next/link";
import UserActions from "@/components/admin/UserActions";
import DeletePostButton from "@/components/posts/DeletePostButton";
import { requireAdmin } from "@/lib/auth/dal";
import { countPosts, findAllPosts } from "@/repositories/post-repository";
import { countUsers, listUsers } from "@/repositories/user-repository";

export const metadata: Metadata = {
  title: "Admin",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function AdminPage() {
  const session = await requireAdmin();
  const [users, posts, postCounts, userCount] = await Promise.all([
    listUsers(),
    findAllPosts(),
    countPosts(),
    countUsers(),
  ]);

  const stats = [
    { label: "Users", value: userCount },
    { label: "Posts", value: postCounts.total },
    { label: "Published", value: postCounts.published },
    { label: "Drafts", value: postCounts.total - postCounts.published },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Users</h2>
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Posts</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/profile/${user.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 text-gray-600">{user.postCount}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {dateFormatter.format(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserActions
                      userId={user.id}
                      role={user.role}
                      isSelf={user.id === session.userId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          All posts ({posts.length})
        </h2>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-gray-900">
                    {post.title}
                  </span>
                  {!post.published && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  by {post.author.name} · updated{" "}
                  {dateFormatter.format(post.updatedAt)}
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
      </section>
    </div>
  );
}
