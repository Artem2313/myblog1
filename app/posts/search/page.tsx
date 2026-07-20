import type { Metadata } from "next";
import { Suspense } from "react";
import Pagination from "@/components/posts/Pagination";
import PostList from "@/components/posts/PostList";
import SearchInput from "@/components/posts/SearchInput";
import { searchPublished } from "@/repositories/post-repository";

export const metadata: Metadata = {
  title: "Search posts",
};

// Search depends on the query string, so this route renders dynamically.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const { posts, totalPages } = query
    ? await searchPublished(query, page)
    : { posts: [], totalPages: 0 };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Search posts</h1>

      <Suspense>
        <SearchInput />
      </Suspense>

      <div className="mt-8">
        {query ? (
          <>
            <PostList
              posts={posts}
              emptyMessage={`No posts found for "${query}".`}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageHref={(target) =>
                `/posts/search?q=${encodeURIComponent(query)}&page=${target}`
              }
            />
          </>
        ) : (
          <p className="py-12 text-center text-gray-500">
            Start typing to search published posts.
          </p>
        )}
      </div>
    </div>
  );
}
