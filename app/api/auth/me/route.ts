import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

/**
 * Returns the logged-in user (without sensitive fields), or null.
 * Used by client components on static/ISR pages, which cannot read
 * the session cookie during prerendering.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: user.id, name: user.name, role: user.role },
  });
}
