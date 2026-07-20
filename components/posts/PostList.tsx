import PostCard from "@/components/posts/PostCard";
import type { PostWithAuthor } from "@/repositories/post-repository";

export default function PostList({
  posts,
  emptyMessage = "No posts found.",
}: {
  posts: PostWithAuthor[];
  emptyMessage?: string;
}) {
  if (posts.length === 0) {
    return <p className="py-12 text-center text-gray-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ul>
  );
}
