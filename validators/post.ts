import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Title must be at least 3 characters long." })
    .max(150, { error: "Title must be at most 150 characters long." }),
  content: z
    .string()
    .trim()
    .min(10, { error: "Content must be at least 10 characters long." }),
  published: z
    .string()
    .optional()
    .transform((value) => value === "on" || value === "true"),
});

export type PostInput = z.infer<typeof postSchema>;
