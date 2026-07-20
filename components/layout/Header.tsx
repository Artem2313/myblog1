import Link from "next/link";
import UserMenu from "@/components/layout/UserMenu";

const navigation = [
  { href: "/posts", label: "Posts" },
  { href: "/posts/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Static header shared by every page. Session-dependent UI lives in
 * <UserMenu/>, a client component, so static and ISR pages stay prerenderable.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-gray-900">
            My Blog
          </Link>
          <nav className="flex items-center gap-5 text-sm text-gray-600">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
