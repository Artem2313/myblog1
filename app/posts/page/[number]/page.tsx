import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PostListingPage from "@/components/posts/PostListingPage";
import { countPublishedPages } from "@/repositories/post-repository";

export const metadata: Metadata = {
  title: "Posts",
};

// ISR with path-segment pagination: every page is prerendered and
// revalidated independently.
export const revalidate = 60;

export async function generateStaticParams() {
  const totalPages = await countPublishedPages();
  return Array.from({ length: totalPages }, (_, index) => ({
    number: String(index + 1),
  }));
}

export default async function PostsPageNumber({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const page = Number(number);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }
  if (page === 1) {
    redirect("/posts");
  }

  return <PostListingPage page={page} />;
}
