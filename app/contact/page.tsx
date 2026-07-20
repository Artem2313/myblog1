import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        <p>Questions, feedback or ideas? We would love to hear from you.</p>
        <ul className="space-y-2">
          <li>
            Email:{" "}
            <a
              href="mailto:hello@example.com"
              className="font-medium text-gray-900 hover:underline"
            >
              hello@example.com
            </a>
          </li>
          <li>GitHub: github.com/example/myblog</li>
        </ul>
      </div>
    </div>
  );
}
