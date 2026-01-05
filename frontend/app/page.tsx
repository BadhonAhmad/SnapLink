import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-4 text-gray-800">
          SnapLink
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Your URL Shortening Solution
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
