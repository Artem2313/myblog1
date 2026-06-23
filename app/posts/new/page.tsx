import PostForm from "@/components/PostForm";
import UserSelect from "@/components/UserSelect";
import { createPost } from "@/actions/actions";

export default function NewPost() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      <PostForm action={createPost} submitLabel="Create Post">
        <UserSelect />
      </PostForm>
    </div>
  );
}
