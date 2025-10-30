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

  // Helper functions to aggregate analytics data
  const getReferrerStats = (analytics: Analytic[]) => {
    const stats: { [key: string]: number } = {};
    analytics.forEach(analytic => {
      const referrer = analytic.referrer || 'None (direct)';
      stats[referrer] = (stats[referrer] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getHostStats = (analytics: Analytic[]) => {
    const stats: { [key: string]: number } = {};
    analytics.forEach(analytic => {
      // Extract host from referrer or use a default
      let host = 'Direct';
      if (analytic.referrer && analytic.referrer !== 'None (direct)') {
        try {
          host = new URL(analytic.referrer).hostname;
        } catch {
          host = analytic.referrer;
        }
      }
      stats[host] = (stats[host] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getBrowserStats = (analytics: Analytic[]) => {
    const stats: { [key: string]: number } = {};
    analytics.forEach(analytic => {
      const browser = analytic.browser || 'Unknown';
      stats[browser] = (stats[browser] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getOSStats = (analytics: Analytic[]) => {
    const stats: { [key: string]: number } = {};
    analytics.forEach(analytic => {
      const os = analytic.os || 'Unknown';
      stats[os] = (stats[os] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getDeviceTypeStats = (analytics: Analytic[]) => {
    const stats: { [key: string]: number } = {};
    analytics.forEach(analytic => {
      const deviceType = analytic.device_type || 'Unknown';
      stats[deviceType] = (stats[deviceType] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                      <div className="space-y-6">
                        {/* Total Visits */}
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Visits</h4>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {summary.analytics?.length || 0}
                            </p>
                          </div>
                        </div>

                        {/* Original URL */}
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            {faviconUrl ? (
                              <img 
                                src={faviconUrl} 
                                alt="Website favicon" 
                                width={16} 
                                height={16}
                                className="rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling!.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <svg className={`w-4 h-4 text-red-600 dark:text-red-400 ${faviconUrl ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Original URL</h4>
                            <a 
                              href={summary.long_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm break-all leading-relaxed underline decoration-blue-300 hover:decoration-blue-500 transition-colors duration-200"
                            >
                              {summary.long_url}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Dashboard */}
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          Page views by source
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Real-time data
                          </div>
                          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <option>5 items</option>
                            <option>10 items</option>
                            <option>All items</option>
                          </select>
                        </div>
                      </div>
                      
                      {summary.analytics && summary.analytics.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Referrers Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Referrers</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              {getReferrerStats(summary.analytics).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(item.count / summary.analytics!.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                      {item.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Paths Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Paths</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">/</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                    {summary.analytics.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Hosts Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Hosts</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              {getHostStats(summary.analytics).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(item.count / summary.analytics!.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                      {item.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Browsers Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Browsers</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              {getBrowserStats(summary.analytics).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(item.count / summary.analytics!.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                      {item.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Operating Systems Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Operating systems</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              {getOSStats(summary.analytics).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(item.count / summary.analytics!.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                      {item.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Device Types Card */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Device types</h4>
                              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="space-y-3">
                              {getDeviceTypeStats(summary.analytics).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(item.count / summary.analytics!.length) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                                      {item.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
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
