"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/useDebounce";

export default function SearchInput() {
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
    params.delete("page");

    router.replace(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <input
      type="search"
      placeholder="Search posts by title or content..."
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(event) => handleSearch(event.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  );
}
