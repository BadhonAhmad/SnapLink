"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const redirect = async () => {
      try {
        // Fetch from backend which will return the original URL or redirect
        const response = await fetch(`${API_URL}/${params.shortCode}`, {
          redirect: 'manual' // Don't follow redirects automatically
        });

        if (response.status === 0 || response.type === 'opaqueredirect') {
          // Redirect happened, follow it
          window.location.href = `${API_URL}/${params.shortCode}`;
        } else if (response.ok) {
          // Get the data and redirect
          const data = await response.json();
          if (data.originalUrl) {
            window.location.href = data.originalUrl;
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        // If there's an error, try direct redirect
        window.location.href = `${API_URL}/${params.shortCode}`;
      }
    };

    redirect();
  }, [params.shortCode, API_URL]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Short URL not found</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 underline">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
