# Cloudflare Pages Deployment Guide

## Quick Setup

### 1. GitHub Repository Setup
Ensure your repository is pushed to GitHub with the latest CI/CD configuration.

### 2. Cloudflare Pages Dashboard Setup

1. **Login to Cloudflare Pages**: https://pages.cloudflare.com/
2. **Create New Project**: 
   - Connect to Git
   - Select your repository: `ivanenkomaksym/surl2`
   - Choose production branch: `main`

3. **Build Configuration**:
   ```
   Build command: npm run build
   Build output directory: out
   Root directory: / (leave empty)
   ```

4. **Environment Variables**:
   ```
   NODE_ENV = production
   NEXT_PUBLIC_BASE_URL = https://short.ivanenkomak.com
   NEXT_TELEMETRY_DISABLED = 1
   ```

### 3. GitHub Secrets Setup

Add these secrets in your GitHub repository settings:

1. **CLOUDFLARE_API_TOKEN**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create token with "Cloudflare Pages:Edit" permissions
   - Add the token to GitHub secrets

2. **CLOUDFLARE_ACCOUNT_ID**:
   - Found in Cloudflare Dashboard → Right sidebar
   - Copy Account ID and add to GitHub secrets

3. **CLOUDFLARE_PROJECT_NAME**:
   - The name of your Cloudflare Pages project
   - Usually matches your repository name: `surl2`

### 4. Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Add your domain (e.g., `surl.example.com`)
4. Cloudflare will handle DNS and SSL automatically

## Deployment Process

### Automatic Deployment
- **Main Branch**: Automatically deploys to production
- **Develop Branch**: Automatically deploys to preview
- **Pull Requests**: Creates preview deployments

### Manual Deployment
```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy manually
npm run build
wrangler pages publish out --project-name=surl2
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check environment variables in Cloudflare Pages dashboard
2. **404 Errors**: Ensure `output: 'export'` is set in `next.config.ts`
3. **Image Issues**: Images must use `unoptimized: true` for static export
4. **API Routes**: Not supported in static export, ensure all APIs are external

### Build Logs
- Check build logs in Cloudflare Pages dashboard
- Monitor GitHub Actions for CI/CD pipeline status

## Performance

Cloudflare Pages provides:
- **Global CDN**: Sub-second response times worldwide
- **Automatic Optimization**: Image and asset optimization
- **HTTP/3 Support**: Latest web protocols
- **Unlimited Bandwidth**: No bandwidth limits
- **SSL/TLS**: Automatic HTTPS certificates
- **DDoS Protection**: Built-in security

## Monitoring

- **Analytics**: Available in Cloudflare Pages dashboard
- **Real User Monitoring**: Track performance metrics
- **Security Events**: Monitor security threats
- **Custom Analytics**: Integrate with external tools

Your URL shortener will be deployed at:
- **Production**: `https://surl2.pages.dev` (or your custom domain)
- **Preview**: Branch-specific URLs for testing