import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OwnerActions from "@/components/posts/OwnerActions";
import {
  findPostBySlug,
  findPublishedSlugs,
} from "@/repositories/post-repository";

// ISR: post pages are prerendered from the published slugs and
// refreshed in the background at most once every 60 seconds.
export const revalidate = 60;

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export async function generateStaticParams() {
  const slugs = await findPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPostBySlug(slug);
  return { title: post?.published ? post.title : "Post not found" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await findPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <article className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          by{" "}
          <Link
            href={`/profile/${post.author.id}`}
            className="font-medium hover:underline"
          >
            {post.author.name}
          </Link>{" "}
          on {dateFormatter.format(post.createdAt)}
        </p>
        <div className="mt-6 whitespace-pre-wrap text-gray-800">
          {post.content}
        </div>
        <OwnerActions
          postId={post.id}
          postSlug={post.slug}
          authorId={post.authorId}
        />
      </article>
      <div className="mt-6">
        <Link href="/posts" className="text-sm text-gray-600 hover:underline">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
