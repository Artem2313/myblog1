import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Welcome to My Blog
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
        A modern full-stack blog built with Next.js, Prisma and PostgreSQL.
        Read posts from the community, or create an account and start writing
        your own.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/posts"
          className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700"
        >
          Browse posts
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
        >
          Start writing
        </Link>
      </div>
    </div>
  );
}
