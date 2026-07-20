import "server-only";

import prisma from "@/lib/prisma";
import type { Post } from "@/lib/generated/prisma/client";

export const POSTS_PER_PAGE = 6;

const authorSummary = {
  select: { id: true, name: true },
} as const;

export type PostWithAuthor = Post & {
  author: { id: number; name: string };
};

export async function findPublishedPage(page: number): Promise<{
  posts: PostWithAuthor[];
  totalPages: number;
}> {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { author: authorSummary },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);
  return { posts, totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
}

export function countPublishedPages(): Promise<number> {
  return prisma.post
    .count({ where: { published: true } })
    .then((total) => Math.max(1, Math.ceil(total / POSTS_PER_PAGE)));
}

export async function searchPublished(
  query: string,
  page: number,
): Promise<{ posts: PostWithAuthor[]; totalPages: number }> {
  const where = {
    published: true,
    OR: [
      { title: { contains: query, mode: "insensitive" as const } },
      { content: { contains: query, mode: "insensitive" as const } },
    ],
  };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: authorSummary },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
  ]);
  return { posts, totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
}

export function findPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  return prisma.post.findUnique({
    where: { slug },
    include: { author: authorSummary },
  });
}

export function findPostById(id: number): Promise<Post | null> {
  return prisma.post.findUnique({ where: { id } });
}

export function findPublishedSlugs(): Promise<string[]> {
  return prisma.post
    .findMany({ where: { published: true }, select: { slug: true } })
    .then((posts) => posts.map((post) => post.slug));
}

export function findPostsByAuthor(
  authorId: number,
  options: { publishedOnly?: boolean } = {},
): Promise<Post[]> {
  return prisma.post.findMany({
    where: {
      authorId,
      ...(options.publishedOnly ? { published: true } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findAllPosts(): Promise<PostWithAuthor[]> {
  return prisma.post.findMany({
    include: { author: authorSummary },
    orderBy: { createdAt: "desc" },
  });
}

export function slugExists(slug: string): Promise<boolean> {
  return prisma.post
    .findUnique({ where: { slug }, select: { id: true } })
    .then(Boolean);
}

export function createPost(data: {
  title: string;
  slug: string;
  content: string;
  published: boolean;
  authorId: number;
}): Promise<Post> {
  return prisma.post.create({ data });
}

export function updatePost(
  id: number,
  data: { title: string; content: string; published: boolean },
): Promise<Post> {
  return prisma.post.update({ where: { id }, data });
}

export function deletePost(id: number): Promise<void> {
  return prisma.post.delete({ where: { id } }).then(() => undefined);
}

export function countPosts(): Promise<{ total: number; published: number }> {
  return Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
  ]).then(([total, published]) => ({ total, published }));
}
