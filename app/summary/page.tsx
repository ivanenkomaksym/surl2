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
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  const handleGetSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSummary(null);
    setFaviconUrl(null);

    try {
      // Extract the shortened code from the URL if a full URL is provided
      const shortCode = shortUrl.includes("/")
        ? shortUrl.split("/").pop() || shortUrl
        : shortUrl;

      const result = await getUrlSummary(shortCode);
      setSummary(result);
      
      // Generate favicon URL for the long URL
      try {
        const url = new URL(result.long_url);
        setFaviconUrl(`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`);
      } catch {
        // If URL parsing fails, don't set favicon
      }
    } catch (err) {
      setError("URL not found. Please check the shortened URL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-4 group">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-green-600 transition-all duration-200">
                SURL
              </h1>
            </Link>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              URL Analytics & Summary
            </p>
          </div>

          {/* Summary Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <form onSubmit={handleGetSummary} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shortened URL
                </label>
                <input
                  type="text"
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                  placeholder="Enter shortened URL or code (e.g., ABC123 or https://short.ivanenkomak.com/ABC123)"
                  required
                  className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading Summary...
                  </div>
                ) : (
                  "Get Summary"
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary Results */}
          {summary && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <div className="space-y-8">
                {/* URL Information */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    {faviconUrl && (
                      <img 
                        src={faviconUrl} 
                        alt="Website favicon" 
                        width={32} 
                        height={32}
                        className="mt-1 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Short URL:
                        </label>
                        <p className="font-mono text-green-600 dark:text-green-400 text-lg">
                          {summary.short_url}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Long URL:
                        </label>
                        <p className="font-mono text-gray-800 dark:text-gray-200 text-sm break-all bg-white dark:bg-gray-800 p-3 rounded-lg border">
                          {summary.long_url}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Section */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    Analytics
                    <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">
                      ({summary.analytics?.length || 0} visits)
                    </span>
                  </h3>
                  
                  {summary.analytics && summary.analytics.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                              Date/Time
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                              Language
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                              OS
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                              Location
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                              IP Address
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                          {summary.analytics.map((analytic: Analytic, index: number) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            >
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(analytic.created_at)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                {analytic.language || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                {analytic.os || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                {analytic.location || "Unknown"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                {analytic.ip || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <div className="text-gray-400 mb-3">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No analytics data available yet.
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                        Analytics will appear here once people start visiting your shortened URL.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200 group"
            >
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Back to URL Shortener</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
