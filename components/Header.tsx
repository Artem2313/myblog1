"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="font-bold text-[#000000] text-lg">
        {pathname.startsWith("/posts") ? "Posts" : "Home"}
      </div>

      {pathname === "/posts" && (
        <Link href="/posts/new" className="text-blue-500 hover:underline">
          Create Post
        </Link>
      )}

      {pathname === "/" && (
        <Link href="/posts" className="text-blue-500 hover:underline">
          Go to Posts
        </Link>
      )}
    </header>
  );
}
