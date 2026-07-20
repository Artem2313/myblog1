/**
 * Shared shape for form state returned by Server Actions used with
 * `useActionState`. `values` echoes what the user typed (never passwords);
 * `errors.form` carries form-level (non-field) messages.
 */
export type FormState<
  Values extends Record<string, string>,
  ErrorKey extends string = Extract<keyof Values, string>,
> = {
  values: Values;
  errors?: Partial<Record<ErrorKey | "form", string[]>>;
};

export type AuthFormValues = {
  name: string;
  email: string;
};

export type PostFormValues = {
  title: string;
  content: string;
  published: string;
};

export type AuthFormState = FormState<
  AuthFormValues,
  "name" | "email" | "password"
>;
export type PostFormState = FormState<PostFormValues>;
