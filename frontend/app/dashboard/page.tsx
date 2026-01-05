"use client";

import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { urlService, Url } from "@/services/urlService";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, FormEvent } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import StatsCard from "@/components/StatsCard";

export default function DashboardPage() {
  const { isLoading } = useAuth();
  const router = useRouter();
  const user = authService.getUser();

  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [urlCount, setUrlCount] = useState(0);
  const [urlLimit, setUrlLimit] = useState(100);
  const [totalClicks, setTotalClicks] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  // Fetch user's URLs
  const fetchUrls = useCallback(async () => {
    const response = await urlService.getUserUrls();
    if (response.success && response.data) {
      setUrls(response.data.urls || []);
      setUrlCount(response.data.count || 0);
      setUrlLimit(response.data.limit || 100);

      // Calculate total clicks
      const clicks = (response.data.urls || []).reduce(
        (sum, url) => sum + url.clicks,
        0
      );
      setTotalClicks(clicks);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchUrls();

      // Set up polling to refresh data every 5 seconds (increased to avoid interfering with copy feedback)
      const intervalId = setInterval(() => {
        fetchUrls();
      }, 5000);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isLoading, fetchUrls]);

  // Handle URL creation
  const handleCreateUrl = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsCreating(true);

    try {
      const response = await urlService.createUrl(longUrl);

      if (response.success) {
        setSuccess("Short URL created successfully!");
        setLongUrl("");
        fetchUrls();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        if (response.limitReached) {
          setError(`⚠️ ${response.message}`);
        } else {
          setError(response.message || "Failed to create short URL");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle URL deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    const response = await urlService.deleteUrl(id);
    if (response.success) {
      fetchUrls();
    } else {
      alert(response.message || "Failed to delete URL");
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (shortUrl: string, id: number) => {
    const success = await urlService.copyToClipboard(shortUrl);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Truncate URL for display
  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name || user?.email || "User"}!
            </p>
          </div>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Links"
            value={urlCount}
            subtitle={`${urlCount}/${urlLimit} limit`}
            color="blue"
          />
          <StatsCard title="Total Clicks" value={totalClicks} color="green" />
          <StatsCard title="Active Links" value={urlCount} color="purple" />
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create Short Link
          </h2>

          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {success && (
            <div className="mb-4">
              <Alert variant="success">{success}</Alert>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleCreateUrl}>
            <Input
              type="url"
              label="Enter your long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              placeholder="https://example.com/very/long/url"
            />
            <Button type="submit" isLoading={isCreating}>
              {isCreating ? "Creating..." : "Shorten URL"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Links</h2>

          {urls.length === 0 ? (
            <p className="text-gray-600">
              No links created yet. Create your first short link above!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <span title={url.originalUrl}>
                            {truncateUrl(url.originalUrl)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {url.shortCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {truncateUrl(url.shortUrl, 40)}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {url.clicks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(url.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopy(url.shortUrl, url.id)}
                            className={`inline-flex items-center justify-center w-20 text-sm font-medium transition-colors ${
                              copiedId === url.id
                                ? "text-green-600 hover:text-green-700"
                                : "text-blue-600 hover:text-blue-700"
                            }`}
                            title="Copy to clipboard"
                          >
                            {copiedId === url.id ? "✓ Copied!" : "Copy"}
                          </button>
                          <button
                            onClick={() => handleDelete(url.id)}
                            className="inline-flex items-center justify-center w-16 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                            title="Delete URL"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
