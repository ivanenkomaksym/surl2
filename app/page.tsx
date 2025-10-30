"use client";

import { useState } from "react";
import { shortenUrl, getUrlSummary } from "@/lib/api";
import { getBaseURL } from "@/lib/config";
import { SummaryResponse, Analytic } from "@/types";
import Link from "next/link";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Summary functionality state
  const [summaryUrl, setSummaryUrl] = useState("");
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'shorten' | 'summary'>('shorten');

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const result = await shortenUrl(longUrl);
      // Construct the full shortened URL using the configured base URL
      const baseUrl = getBaseURL();
      const fullShortUrl = `${baseUrl}/${result.short_url}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSummaryLoading(true);
    setSummaryError("");
    setSummary(null);
    setFaviconUrl(null);

    try {
      // Extract the shortened code from the URL if a full URL is provided
      const shortCode = summaryUrl.includes("/")
        ? summaryUrl.split("/").pop() || summaryUrl
        : summaryUrl;

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
      setSummaryError("URL not found. Please check the shortened URL.");
      console.error(err);
    } finally {
      setSummaryLoading(false);
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
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              SURL
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              URL Shortener & Analytics
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8 shadow-inner">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'shorten'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Shorten URL
              </div>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'summary'
                  ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                URL Analytics
              </div>
            </button>
          </div>

          {/* URL Shortening Tab */}
          {activeTab === 'shorten' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleShorten} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Long URL
                    </label>
                    <input
                      type="url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://example.com/very/long/url"
                      required
                      className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>
                  
                  {shortUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Short URL
                      </label>
                      <input
                        type="text"
                        value={shortUrl}
                        readOnly
                        className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono transition-all duration-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Shortening...
                      </div>
                    ) : (
                      "Shorten"
                    )}
                  </button>
                  
                  {shortUrl && (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="px-8 py-4 bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
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

              {shortUrl && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-600 dark:text-green-400 font-medium">URL shortened successfully!</p>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Switch to the <strong>URL Analytics</strong> tab to view detailed statistics for your shortened URLs.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-8">
              {/* Summary Input Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <form onSubmit={handleGetSummary} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shortened URL
                    </label>
                    <input
                      type="text"
                      value={summaryUrl}
                      onChange={(e) => setSummaryUrl(e.target.value)}
                      placeholder="Enter shortened URL or code (e.g., ABC123 or https://short.ivanenkomak.com/ABC123)"
                      required
                      className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={summaryLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {summaryLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Loading Analytics...
                      </div>
                    ) : (
                      "Get Analytics"
                    )}
                  </button>
                </form>

                {summaryError && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 dark:text-red-400 font-medium">{summaryError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Results */}
              {summary && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  <div className="space-y-8">
                    {/* URL Information Card */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-4">
                        {faviconUrl && (
                          <div className="flex-shrink-0">
                            <img 
                              src={faviconUrl} 
                              alt="Website favicon" 
                              width={40} 
                              height={40}
                              className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                                🔗 Short URL
                              </label>
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-sm">
                                <p className="font-mono text-green-600 dark:text-green-400 text-lg font-semibold">
                                  {summary.short_url}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                                📊 Total Visits
                              </label>
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-sm">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                  {summary.analytics?.length || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              🌐 Original URL
                            </label>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-sm">
                              <p className="font-mono text-gray-800 dark:text-gray-200 text-sm break-all">
                                {summary.long_url}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Section */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          📈 Detailed Analytics
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Real-time data
                        </div>
                      </div>
                      
                      {summary.analytics && summary.analytics.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  📅 Date & Time
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  🌍 Language
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  💻 Operating System
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  📍 Location
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                  🔒 IP Address
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {summary.analytics.map((analytic: Analytic, index: number) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                                >
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {formatDate(analytic.created_at)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      {analytic.language || "Unknown"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                      {analytic.os || "Unknown"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      {analytic.location || "Unknown"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                      {analytic.ip || "N/A"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <div className="text-gray-400 dark:text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No Analytics Data Yet
                          </h4>
                          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                            Analytics will appear here once people start visiting your shortened URL. Share your link to start collecting data!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
