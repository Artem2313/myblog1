import type { Metadata } from "next";
import { createPostAction } from "@/actions/post-actions";
import PostForm from "@/components/posts/PostForm";
import { requireSession } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: "New post",
};

export default async function NewPostPage() {
  await requireSession();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Write a new post</h1>
      <PostForm action={createPostAction} submitLabel="Create post" />
    </div>
  );
}
