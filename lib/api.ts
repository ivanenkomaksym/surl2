import { ShortenResponse, SummaryResponse } from "@/types";
import { getBaseURL } from "./config";

const API_BASE_URL = getBaseURL();

export async function shortenUrl(longUrl: string): Promise<ShortenResponse> {
  const response = await fetch(`${API_BASE_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ long_url: longUrl }),
  });
  
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
