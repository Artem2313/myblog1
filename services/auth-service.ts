import "server-only";

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createUser,
  findUserWithPasswordByEmail,
  type SafeUser,
} from "@/repositories/user-repository";
import type { RegisterInput, LoginInput } from "@/validators/auth";

export type AuthResult =
  | { ok: true; user: SafeUser }
  | { ok: false; error: string };

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await findUserWithPasswordByEmail(input.email);
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: await hashPassword(input.password),
  });
  return { ok: true, user };
}

export async function authenticateUser(input: LoginInput): Promise<AuthResult> {
  const user = await findUserWithPasswordByEmail(input.email);
  if (!user || !(await verifyPassword(input.password, user.password))) {
    return { ok: false, error: "Invalid email or password." };
  }

  const { id, name, email, role, createdAt } = user;
  return { ok: true, user: { id, name, email, role, createdAt } };
}
