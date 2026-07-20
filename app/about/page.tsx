import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">About</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        <p>
          My Blog is a demonstration of a production-quality full-stack
          application built with the Next.js App Router.
        </p>
        <p>
          It showcases every rendering strategy: this page is fully static,
          the post listing is prerendered and incrementally regenerated, and
          the dashboard is rendered dynamically per request.
        </p>
        <p>
          Under the hood it uses Prisma with PostgreSQL, secure cookie-based
          sessions with hashed passwords, role-based access control and
          server-side validation with Zod.
        </p>
      </div>
    </div>
  );
}
