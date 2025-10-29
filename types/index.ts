export interface Analytic {
  created_at: string;
  language?: string;
  os?: string;
  ip?: string;
  location?: string;
}

export interface ShortenResponse {
  short_url: string;
  long_url: string;
  analytics: Analytic[];
}

export interface SummaryResponse {
  short_url: string;
  long_url: string;
  analytics: Analytic[];
}
