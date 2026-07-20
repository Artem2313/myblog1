import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Log in</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-gray-900 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
