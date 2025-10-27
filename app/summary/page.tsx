"use client";

import { useState } from "react";
import { getUrlSummary } from "@/lib/api";
import { SummaryResponse, Analytic } from "@/types";
import Link from "next/link";

export default function SummaryPage() {
  const [shortUrl, setShortUrl] = useState("");
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary(null);

    try {
      // Extract the shortened code from the URL if a full URL is provided
      const shortCode = shortUrl.includes("/")
        ? shortUrl.split("/").pop() || shortUrl
        : shortUrl;

      const result = await getUrlSummary(shortCode);
      setSummary(result);
    } catch (err) {
      setError("Failed to get URL summary. Please check the shortened URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">
              SURL
            </h1>
          </Link>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            View URL Analytics Summary
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleGetSummary} className="space-y-4">
            <div>
              <label
                htmlFor="shortUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Enter shortened URL or code
              </label>
              <input
                type="text"
                id="shortUrl"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                placeholder="abc123 or https://short.ivanenkomak.com/abc123"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? "Loading..." : "Get Summary"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {summary && (
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  URL Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Short URL:
                    </span>
                    <p className="font-mono text-blue-600 dark:text-blue-400">
                      {summary.shortUrl}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Long URL:
                    </span>
                    <p className="font-mono text-sm break-all text-gray-800 dark:text-gray-200">
                      {summary.longUrl}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Analytics ({summary.analytics?.length || 0} visits)
                </h3>
                {summary.analytics && summary.analytics.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Language
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            OS
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Location
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                            IP
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.analytics.map((analytic: Analytic, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(analytic.created_at)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {analytic.language || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {analytic.os || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {analytic.location || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                              {analytic.ip || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No analytics data available yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
