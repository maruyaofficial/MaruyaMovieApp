# Maruya Streaming Player - Complete Package

## 📦 What's Included

This download contains your complete professional streaming platform with all deployment configurations:

### Core Application
- **React Frontend**: Modern streaming interface with dark theme and Poppins font
- **Express Backend**: API server with TMDB integration and streaming servers
- **TypeScript**: Full type safety across frontend and backend
- **Database Schema**: PostgreSQL with Drizzle ORM (optional, uses memory storage by default)

### Deployment Configurations
- **Vercel**: Ready-to-deploy serverless configuration
- **Cloudflare Pages**: Edge functions and global CDN setup
- **Local Development**: Complete dev environment setup

### Features
- 🎬 Browse movies and TV shows with real TMDB data
- 🔍 Real-time search functionality
- 📝 Personal watchlist management
- 🎥 Multiple streaming servers (Vidsrc, Vipstream)
- 🌙 Professional dark theme with Poppins font
- 📱 Fully responsive design
- ⚡ Fast loading with modern architecture

## 🚀 Quick Start

1. **Extract the files**:
   ```bash
   tar -xzf maruya-streaming-player-complete.tar.gz
   cd [extracted-folder]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   ```bash
   echo "TMDB_API_KEY=ba3885a53bc2c4f3c4b5bdc1237e69a0" > .env
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**: http://localhost:5000

## 🌐 Deployment Options

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Cloudflare Pages
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist/public --project-name=maruya-streaming-player
```

### Deploy to any Node.js hosting
```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # UI components (video player, search, etc.)
│   │   ├── pages/              # Route pages (home, player, 404)
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities and API client
├── server/                     # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API route handlers
│   └── storage.ts             # Data storage interface
├── functions/                  # Cloudflare Pages Functions
├── api/                       # Vercel serverless functions
├── shared/                    # Shared TypeScript schemas
├── dist/                      # Built application (created on build)
├── vercel.json                # Vercel deployment config
├── wrangler.toml              # Cloudflare deployment config
├── _headers                   # Cloudflare headers config
├── _redirects                 # Cloudflare routing config
├── package.json               # Dependencies and scripts
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Vercel deployment guide
├── CLOUDFLARE_DEPLOYMENT.md   # Cloudflare deployment guide
└── DOWNLOAD_GUIDE.md          # This file
```

## 🔑 Environment Variables

| Variable | Description | Value |
|----------|-------------|-------|
| `TMDB_API_KEY` | The Movie Database API key | `ba3885a53bc2c4f3c4b5bdc1237e69a0` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection (optional) | Your database URL |

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema (if using PostgreSQL)

## 📚 Documentation Files

- **README.md**: Main project documentation
- **DEPLOYMENT.md**: Vercel deployment guide
- **CLOUDFLARE_DEPLOYMENT.md**: Cloudflare Pages deployment guide
- **replit.md**: Project architecture and preferences

## 🎯 Ready-to-Deploy Features

- Professional Netflix-like interface
- Real movie and TV show data from TMDB
- Multiple streaming server integration
- Search and discovery functionality
- Responsive design for all devices
- Dark theme with modern typography
- Fast loading and optimized performance

## 🔧 Customization

- **Styling**: Edit `client/src/index.css` for theme customization
- **API**: Modify `server/routes.ts` for additional endpoints
- **Components**: Add new components in `client/src/components/`
- **Streaming Servers**: Update server configurations in the API routes

Your professional streaming platform is ready to deploy to any modern hosting platform!