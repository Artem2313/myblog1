import PostForm from "@/components/PostForm";
import UserSelect from "@/components/UserSelect";
import { updatePost } from "@/actions/actions";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseInt(id);

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    notFound();
  }

  const updatePostWithId = updatePost.bind(null, postId);

  const initialValues = {
    title: post.title,
    content: post.content || "",
    authorId: String(post.authorId),
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <PostForm
        action={updatePostWithId}
        initialValues={initialValues}
        submitLabel="Update Post"
      >
        <UserSelect defaultValue={initialValues.authorId} />
      </PostForm>
    </div>
  );
}
