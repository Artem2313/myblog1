import "server-only";

import { slugify } from "@/lib/slug";
import type { SessionPayload } from "@/lib/auth/session";
import type { Post } from "@/lib/generated/prisma/client";
import * as postRepository from "@/repositories/post-repository";
import type { PostInput } from "@/validators/post";

export type PostResult =
  | { ok: true; post: Post }
  | { ok: false; error: string };

/** Owners may modify their own posts; admins may modify any post. */
export function canModifyPost(
  post: Pick<Post, "authorId">,
  session: SessionPayload,
): boolean {
  return session.role === "ADMIN" || post.authorId === session.userId;
}

async function uniqueSlugFor(title: string): Promise<string> {
  const base = slugify(title) || "post";
  let slug = base;
  for (let suffix = 2; await postRepository.slugExists(slug); suffix++) {
    slug = `${base}-${suffix}`;
  }
  return slug;
}

export async function createPost(
  input: PostInput,
  session: SessionPayload,
): Promise<PostResult> {
  const post = await postRepository.createPost({
    title: input.title,
    slug: await uniqueSlugFor(input.title),
    content: input.content,
    published: input.published,
    authorId: session.userId,
  });
  return { ok: true, post };
}

export async function updatePost(
  postId: number,
  input: PostInput,
  session: SessionPayload,
): Promise<PostResult> {
  const post = await postRepository.findPostById(postId);
  if (!post) {
    return { ok: false, error: "Post not found." };
  }
  if (!canModifyPost(post, session)) {
    return { ok: false, error: "You are not allowed to edit this post." };
  }

  const updated = await postRepository.updatePost(postId, {
    title: input.title,
    content: input.content,
    published: input.published,
  });
  return { ok: true, post: updated };
}

export async function deletePost(
  postId: number,
  session: SessionPayload,
): Promise<PostResult> {
  const post = await postRepository.findPostById(postId);
  if (!post) {
    return { ok: false, error: "Post not found." };
  }
  if (!canModifyPost(post, session)) {
    return { ok: false, error: "You are not allowed to delete this post." };
  }

  await postRepository.deletePost(postId);
  return { ok: true, post };
}
