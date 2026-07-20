"use client";

import Form from "next/form";
import { useActionState } from "react";
import { login } from "@/actions/auth-actions";
import FieldError from "@/components/ui/FieldError";
import SubmitButton from "@/components/ui/SubmitButton";
import TextInput from "@/components/ui/TextInput";
import type { AuthFormState } from "@/types/forms";

const initialState: AuthFormState = {
  values: { name: "", email: "" },
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <Form action={action} className="space-y-4">
      <TextInput
        label="Email"
        name="email"
        type="email"
        defaultValue={state.values.email}
        errors={state.errors?.email}
      />
      <TextInput label="Password" name="password" type="password" errors={state.errors?.password} />
      <FieldError messages={state.errors?.form} />
      <SubmitButton pending={pending} pendingLabel="Logging in...">
        Log in
      </SubmitButton>
    </Form>
  );
}
