import type { Metadata } from "next";
import PostListingPage from "@/components/posts/PostListingPage";

export const metadata: Metadata = {
  title: "Posts",
};

// ISR: the listing is prerendered and refreshed in the background
// at most once every 60 seconds.
export const revalidate = 60;

export default function PostsPage() {
  return <PostListingPage page={1} />;
}
