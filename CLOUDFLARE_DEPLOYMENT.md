# Cloudflare Pages Deployment Guide

Deploy your Maruya streaming player to Cloudflare Pages with serverless functions.

## 🚀 Quick Deploy to Cloudflare Pages

### Option 1: Deploy via Wrangler CLI (Recommended)

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create and deploy**:
   ```bash
   wrangler pages project create maruya-streaming-player
   npm run build
   wrangler pages deploy dist/public --project-name maruya-streaming-player
   ```

4. **Set environment variables**:
   ```bash
   wrangler pages secret put TMDB_API_KEY
   # Enter: ba3885a53bc2c4f3c4b5bdc1237e69a0
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Maruya streaming player"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages → Create a project
   - Connect your GitHub repository
   - Use these settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist/public`
     - **Root directory**: `/` (leave empty)

3. **Set environment variables**:
   - In Pages project settings → Environment variables
   - Add: `TMDB_API_KEY` = `ba3885a53bc2c4f3c4b5bdc1237e69a0`

## 📁 Project Structure for Cloudflare

```
├── functions/
│   └── api/
│       └── [[route]].ts    # Cloudflare Pages Functions (API routes)
├── dist/
│   └── public/            # Built React app (static files)
├── wrangler.toml          # Cloudflare configuration
├── _headers               # HTTP headers configuration
├── _redirects             # URL routing rules
└── package.json           # Build scripts and dependencies
```

## ⚙️ How Cloudflare Deployment Works

1. **Frontend**: React app builds to `dist/public/` → served as static files via Cloudflare CDN
2. **Backend**: API routes in `functions/api/[[route]].ts` → run as Cloudflare Pages Functions
3. **Routing**: `_redirects` file routes `/api/*` to functions, everything else to React app
4. **Build**: `npm run build` creates both frontend and serverless function code

## 🌍 Features with Cloudflare Pages

- **Global CDN**: Fast loading worldwide
- **Serverless Functions**: API endpoints with 0ms cold starts
- **Automatic HTTPS**: Built-in SSL certificates
- **Branch Deployments**: Preview deployments for every commit
- **Edge Computing**: Functions run at edge locations globally

## 📋 Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `TMDB_API_KEY` | Your TMDB API key | Yes |

## 🔧 Local Development with Cloudflare

Test your deployment locally:

```bash
# Build the project
npm run build

# Start local Cloudflare Pages development
wrangler pages dev dist/public --compatibility-date=2024-08-06
```

## 🚨 Troubleshooting

**Build Fails?**
- Ensure `npm run build` works locally
- Check that all dependencies are installed
- Verify Node.js compatibility (use Node.js 18+)

**API Functions Not Working?**
- Check `TMDB_API_KEY` is set in Cloudflare Pages environment variables
- Verify functions are in `functions/api/` directory
- Check function logs in Cloudflare dashboard

**CORS Issues?**
- Headers are configured in `_headers` file
- API routes include proper CORS headers

**Routing Problems?**
- Check `_redirects` file syntax
- Ensure React Router is configured for client-side routing

## 🎯 Post-Deployment

After successful deployment:

1. **Live URL**: Your app will be available at `https://maruya-streaming-player.pages.dev`
2. **Custom Domain**: Add your own domain in Cloudflare Pages settings
3. **Performance**: Benefit from Cloudflare's global CDN and edge functions
4. **Monitoring**: Use Cloudflare Analytics to track usage and performance

## 🔄 Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch → automatic production deployment
- Pull requests → automatic preview deployments
- Branch deployments → test features before merging

Your professional streaming platform will be deployed globally with enterprise-grade performance and security!