import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Superblog
      </h1>
      <div>
        <Link href="/posts" className="text-blue-500 hover:underline">
          View Posts
        </Link>
      </div>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)] text-[#333333] max-w-2xl space-y-2">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
