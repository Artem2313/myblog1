"use client";

import Form from "next/form";
import { useActionState } from "react";
import FieldError from "@/components/ui/FieldError";
import SubmitButton from "@/components/ui/SubmitButton";
import TextInput from "@/components/ui/TextInput";
import type { PostFormState, PostFormValues } from "@/types/forms";

type Props = {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  initialValues?: PostFormValues;
  submitLabel: string;
};

const emptyValues: PostFormValues = {
  title: "",
  content: "",
  published: "",
};

export default function PostForm({
  action: formAction,
  initialValues = emptyValues,
  submitLabel,
}: Props) {
  const [state, action, pending] = useActionState(formAction, {
    values: initialValues,
  });

  return (
    <Form action={action} className="space-y-5">
      <TextInput
        label="Title"
        name="title"
        defaultValue={state.values.title}
        errors={state.errors?.title}
      />

      <div>
        <label
          htmlFor="content"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={state.values.content}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <FieldError messages={state.errors?.content} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={state.values.published === "on"}
          className="h-4 w-4 rounded border-gray-300"
        />
        Publish this post
      </label>

      <FieldError messages={state.errors?.form} />
      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
    </Form>
  );
}
