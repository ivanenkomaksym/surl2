# URL Shortener

[![CI/CD Pipeline](https://github.com/ivanenkomaksym/surl2/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ivanenkomaksym/surl2/actions/workflows/ci-cd.yml)
[![Security Audit](https://github.com/ivanenkomaksym/surl2/actions/workflows/security.yml/badge.svg)](https://github.com/ivanenkomaksym/surl2/actions/workflows/security.yml)
[![CodeQL](https://github.com/ivanenkomaksym/surl2/actions/workflows/security.yml/badge.svg?event=schedule)](https://github.com/ivanenkomaksym/surl2/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)

> **Create shorter URLs and track link analytics**

A modern, responsive URL shortening service frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, shareable links
- 📊 **Analytics Dashboard**: View detailed analytics for shortened URLs including:
  - Visit timestamps
  - Language preferences
  - Operating systems
  - Geographic locations
  - IP addresses
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- ⚡ **Fast**: Built with Next.js 15 for optimal performance
- 🔒 **Type-Safe**: Full TypeScript coverage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **UI Library**: React 19
- **Backend API**: https://short.ivanenkomak.com

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ivanenkomaksym/surl2.git
cd surl2

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Base URL for the URL shortener service
NEXT_PUBLIC_BASE_URL=http://localhost
```

**Environment Variables:**
- `NEXT_PUBLIC_BASE_URL`: Base URL for the URL shortener service
  - Development: `http://localhost`
  - Production: `https://short.ivanenkomak.com`

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create an optimized production build
npm run build

# For local production testing (optional)
npm start

# For Cloudflare Pages deployment
# The build creates static files in the 'out' directory
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
surl2/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page - URL shortening
│   ├── summary/           # Summary page directory
│   │   └── page.tsx       # Analytics summary page
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   └── api.ts            # API service functions
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types and interfaces
├── public/               # Static assets
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## API Integration

The frontend integrates with the following API endpoints:

### Shorten URL
```
POST /shorten
Content-Type: application/json

{
  "long_url": "https://example.com/very/long/url"
}
```
Returns a shortened URL for the provided long URL.

### Get URL Summary
```
GET /${shortenedUrl}/summary
```
Returns analytics data for a shortened URL.

The API base URL is configurable through environment variables and automatically switches between development and production environments.

## Analytics Model

```typescript
interface Analytic {
  created_at: string;
  language?: string;
  os?: string;
  ip?: string;
  location?: string;
}
```

## License

This project is open source and available under the MIT License.

## Deployment

This project is configured for Cloudflare Pages deployment with automatic CI/CD.

### Cloudflare Pages Setup

1. **Connect Repository**: Connect your GitHub repository to Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
   - Node.js version: `20`

3. **Environment Variables**: Set in Cloudflare Pages dashboard:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_BASE_URL`: `https://short.ivanenkomak.com`

4. **GitHub Secrets**: For CI/CD pipeline, add these secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `CLOUDFLARE_PROJECT_NAME`: Your Cloudflare Pages project name

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy using Wrangler CLI (optional)
npx wrangler pages publish out
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
