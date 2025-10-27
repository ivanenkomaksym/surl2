import { ShortenResponse, SummaryResponse } from "@/types";

const API_BASE_URL = "https://short.ivanenkomak.com";

export async function shortenUrl(longUrl: string): Promise<ShortenResponse> {
  const response = await fetch(`${API_BASE_URL}/shorten?long_url=${encodeURIComponent(longUrl)}`);
  
  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }
  
  return response.json();
}

export async function getUrlSummary(shortenedUrl: string): Promise<SummaryResponse> {
  const response = await fetch(`${API_BASE_URL}/${shortenedUrl}/summary`);
  
  if (!response.ok) {
    throw new Error("Failed to get URL summary");
  }
  
  return response.json();
}
