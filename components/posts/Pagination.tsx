import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  /** Builds the href for a given page number, e.g. `/posts/page/2`. */
  pageHref: (page: number) => string;
};

export default function Pagination({ currentPage, totalPages, pageHref }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center gap-2">
      {pages.map((page) =>
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            {page}
          </Link>
        ),
      )}
    </nav>
  );
}
