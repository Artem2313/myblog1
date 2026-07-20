import type { Role } from "@/lib/generated/prisma/enums";

/** The subset of the user record exposed to client components. */
export type SessionUser = {
  id: number;
  name: string;
  role: Role;
};
