"use client";

import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((...args: unknown[]) => {
    const term = typeof args[0] === "string" ? args[0] : "";
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="w-full max-w-2xl mb-8">
      <input
        type="text"
        placeholder="Search posts by title..."
        className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-sans)]"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
