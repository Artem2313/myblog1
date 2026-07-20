import Link from "next/link";
import { notFound } from "next/navigation";
import Pagination from "@/components/posts/Pagination";
import PostList from "@/components/posts/PostList";
import { findPublishedPage } from "@/repositories/post-repository";

/** Shared server component for /posts (page 1) and /posts/page/[number]. */
export default async function PostListingPage({ page }: { page: number }) {
  const { posts, totalPages } = await findPublishedPage(page);

  if (page > 1 && posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/posts/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Write a post
        </Link>
      </div>

      <PostList posts={posts} emptyMessage="No posts published yet." />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageHref={(target) => (target === 1 ? "/posts" : `/posts/page/${target}`)}
      />
    </div>
  );
}
