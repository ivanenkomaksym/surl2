# SURL - URL Shortener Frontend

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
```

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

# Start the production server
npm start
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
GET /shorten?long_url={long_url}
```
Returns a shortened URL for the provided long URL.

### Get URL Summary
```
GET /${shortenedUrl}/summary
```
Returns analytics data for a shortened URL.

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
