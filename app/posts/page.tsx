import Link from "next/link";

import prisma from "@/lib/prisma";
import Search from "@/components/Search";

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";

  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 text-[#333333] p-4">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">
        Posts
      </h1>

      <Search />

      <ul className="font-[family-name:var(--font-geist-sans)] w-full max-w-2xl space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="p-4 bg-white rounded shadow">
            <Link href={`/posts/${post.id}`}>
              <span className="font-semibold">{post.title}</span>
              <span className="text-sm text-gray-600 ml-2">
                by {post.author.name}
              </span>
            </Link>
          </li>
        ))}

        {posts.length === 0 && (
          <li className="p-4 text-center text-gray-500">
            No posts found for {query}.
          </li>
        )}
      </ul>
    </div>
  );
}
