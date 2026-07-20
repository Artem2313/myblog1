import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { updatePostAction } from "@/actions/post-actions";
import PostForm from "@/components/posts/PostForm";
import { requireSession } from "@/lib/auth/dal";
import { findPostBySlug } from "@/repositories/post-repository";
import { canModifyPost } from "@/services/post-service";

export const metadata: Metadata = {
  title: "Edit post",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireSession();
  const { slug } = await params;

  const post = await findPostBySlug(slug);
  if (!post) {
    notFound();
  }
  if (!canModifyPost(post, session)) {
    redirect(`/posts/${slug}`);
  }

  const boundUpdateAction = updatePostAction.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit post</h1>
      <PostForm
        action={boundUpdateAction}
        initialValues={{
          title: post.title,
          content: post.content,
          published: post.published ? "on" : "",
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
