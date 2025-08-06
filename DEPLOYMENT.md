# Vercel Deployment Guide for Maruya Streaming Player

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard:
   - Go to your project settings in Vercel dashboard
   - Add environment variable: `TMDB_API_KEY` = `ba3885a53bc2c4f3c4b5bdc1237e69a0`

### Option 2: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Add environment variables**:
   - In Vercel dashboard, go to project settings
   - Add: `TMDB_API_KEY` = `ba3885a53bc2c4f3c4b5bdc1237e69a0`

## Project Structure for Vercel

```
├── api/
│   └── index.ts          # Serverless API functions
├── client/               # React frontend
├── server/               # Express backend (bundled for serverless)
├── dist/
│   └── public/          # Built frontend files
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and build scripts
```

## How It Works

1. **Frontend**: React app is built to `dist/public/` and served as static files
2. **Backend**: Express API is converted to serverless functions in `/api/`
3. **Routing**: Vercel routes `/api/*` to serverless functions, everything else to static files
4. **Build Process**: 
   - Vite builds the React frontend
   - ESBuild bundles the Express server for serverless deployment

## Environment Variables Needed

| Variable | Value | Required |
|----------|-------|----------|
| `TMDB_API_KEY` | Your TMDB API key | Yes |
| `NODE_ENV` | `production` | Auto-set by Vercel |

## Troubleshooting

**Build Fails?**
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally

**API Not Working?**
- Verify `TMDB_API_KEY` is set in Vercel environment variables
- Check function logs in Vercel dashboard

**404 Errors?**
- Ensure `vercel.json` routing is correct
- Check that frontend files are in `dist/public/`

## Post-Deployment

After successful deployment:
1. Your app will be live at `https://your-project-name.vercel.app`
2. Test the movie browsing functionality
3. Verify video player works with streaming servers
4. Check search and watchlist features

The deployment is fully automated - any pushes to your main branch will trigger automatic redeployments.