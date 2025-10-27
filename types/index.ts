export class Analytic {
  created_at!: string;
  language?: string;
  os?: string;
  ip?: string;
  location?: string;
}

export interface ShortenResponse {
  shortUrl: string;
  longUrl: string;
}

export interface SummaryResponse {
  shortUrl: string;
  longUrl: string;
  analytics: Analytic[];
}
