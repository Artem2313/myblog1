"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { createSession, deleteSession } from "@/lib/auth/session";
import { authenticateUser, registerUser } from "@/services/auth-service";
import { loginSchema, registerSchema } from "@/validators/auth";
import type { AuthFormState } from "@/types/forms";

export async function register(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = registerSchema.safeParse({
    ...values,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) {
    return { values, errors: { form: [result.error] } };
  }

  await createSession({ userId: result.user.id, role: result.user.role });
  redirect("/dashboard");
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = {
    name: "",
    email: String(formData.get("email") ?? ""),
  };

  const parsed = loginSchema.safeParse({
    email: values.email,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { values, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const result = await authenticateUser(parsed.data);
  if (!result.ok) {
    return { values, errors: { form: [result.error] } };
  }

  await createSession({ userId: result.user.id, role: result.user.role });
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
