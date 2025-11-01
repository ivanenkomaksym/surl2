/**
 * Configuration utilities for the URL shortener
 */

/**
 * Get the base URL for the URL shortener service
 */
export const getBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost";
};