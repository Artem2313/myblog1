"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short"),
  content: z.string().trim().min(10, "Content is too short"),
  authorId: z.coerce.number().positive("Select an author"),
});

export type FormState = {
  values: {
    title: string;
    content: string;
    authorId: string;
  };
  errors?: {
    title?: string[];
    content?: string[];
    authorId?: string[];
  };
};

export async function createPost(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    authorId: String(formData.get("authorId") ?? ""),
  };

  const result = schema.safeParse(values);

  if (!result.success) {
    return {
      values,
      errors: result.error.flatten().fieldErrors,
    };
  }

  await prisma.post.create({
    data: result.data,
  });

  revalidatePath("/posts");
  redirect("/posts");
}
