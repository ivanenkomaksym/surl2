# Cloudflare Pages Configuration

## Build Configuration
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/`
- **Node.js version**: `20`

## Environment Variables
Set these in your Cloudflare Pages dashboard:

### Required Environment Variables
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_BASE_URL`: `https://short.ivanenkomak.com` (or your backend URL)

### Optional Environment Variables
- `NEXT_TELEMETRY_DISABLED`: `1` (to disable Next.js telemetry)

## Build Settings
The project is configured with:
- Static export enabled (`output: 'export'`)
- Image optimization disabled (required for static export)
- Trailing slash enabled for better compatibility

## Deployment Process
1. **Automatic Deployments**: Connected to GitHub repository
2. **Branch Deployments**: 
   - `main` branch → Production
   - `develop` branch → Preview
3. **Pull Request Previews**: Automatic preview deployments for PRs

## Custom Domain Setup
1. Go to Cloudflare Pages → Custom domains
2. Add your custom domain
3. Cloudflare will automatically configure DNS and SSL

## Performance Optimizations
- Cloudflare's global CDN
- Automatic GZIP compression
- HTTP/2 and HTTP/3 support
- Automatic SSL/TLS certificates
- Edge caching for static assets

## GitHub Integration
The CI/CD pipeline will automatically deploy to Cloudflare Pages when:
- Code is pushed to `main` branch
- All tests and quality checks pass
- Build completes successfully