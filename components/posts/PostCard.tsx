import Link from "next/link";
import type { PostWithAuthor } from "@/repositories/post-repository";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export default function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <li className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow">
      <Link href={`/posts/${post.slug}`} className="group block">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:underline">
          {post.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.content}</p>
      </Link>
      <p className="mt-3 text-xs text-gray-500">
        by{" "}
        <Link
          href={`/profile/${post.author.id}`}
          className="font-medium hover:underline"
        >
          {post.author.name}
        </Link>{" "}
        on {dateFormatter.format(post.createdAt)}
      </p>
    </li>
  );
}
