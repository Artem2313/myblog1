import PostForm from "@/components/PostForm";
import UserSelect from "@/components/UserSelect";

export default function NewPost() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      <PostForm>
        <UserSelect />
      </PostForm>
    </div>
  );
}
