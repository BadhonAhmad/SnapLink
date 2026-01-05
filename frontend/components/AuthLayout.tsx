import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: {
    text: string;
    linkText: string;
    linkHref: string;
  };
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {children}

          {footer && (
            <p className="text-center text-sm text-gray-600">
              {footer.text}{" "}
              <Link
                href={footer.linkHref}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {footer.linkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
