"use client";

import { FormState } from "@/actions/actions";
import Form from "next/form";
import { useActionState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  action: (state: FormState, payload: FormData) => Promise<FormState>;
  initialValues?: FormState["values"];
  submitLabel?: string;
};

const defaultValues = {
  title: "",
  content: "",
  authorId: "",
};

export default function PostForm({
  children,
  action: formAction,
  initialValues = defaultValues,
  submitLabel = "Save Post",
}: Props) {
  const [state, action, pending] = useActionState(formAction, {
    values: initialValues,
  });

  return (
    <Form action={action} className="space-y-6">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className="w-full px-4 py-2 border rounded-lg"
          defaultValue={state.values.title}
        />
        {state.errors?.title?.[0] && (
          <p className="text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={6}
          className="w-full px-4 py-2 border rounded-lg"
          defaultValue={state.values.content}
        />
        {state.errors?.content?.[0] && (
          <p className="text-red-500">{state.errors.content[0]}</p>
        )}
      </div>

      {children}

      {state.errors?.authorId?.[0] && (
        <p className="text-red-500">{state.errors.authorId[0]}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-blue-500 text-white py-3 rounded-lg disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </Form>
  );
}
