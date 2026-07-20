"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { requireSession } from "@/lib/auth/dal";
import * as postService from "@/services/post-service";
import { postSchema } from "@/validators/post";
import type { PostFormState } from "@/types/forms";

function readPostFormValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    published: String(formData.get("published") ?? ""),
  };
}

/** Revalidates every route under /posts (listing pages, detail pages, search). */
function revalidatePosts() {
  revalidatePath("/posts", "layout");
}

export async function createPostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await requireSession();
  const values = readPostFormValues(formData);

  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await postService.createPost(parsed.data, session);
  if (!result.ok) {
    return { values, errors: { form: [result.error] } };
  }

  revalidatePosts();
  redirect(result.post.published ? `/posts/${result.post.slug}` : "/dashboard");
}

export async function updatePostAction(
  postId: number,
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const session = await requireSession();
  const values = readPostFormValues(formData);

  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await postService.updatePost(postId, parsed.data, session);
  if (!result.ok) {
    return { values, errors: { form: [result.error] } };
  }

  revalidatePosts();
  redirect(result.post.published ? `/posts/${result.post.slug}` : "/dashboard");
}

export async function deletePostAction(postId: number): Promise<void> {
  const session = await requireSession();

  const result = await postService.deletePost(postId, session);
  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePosts();
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
