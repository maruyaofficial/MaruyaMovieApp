# Maruya Streaming Player

A professional movie and TV show streaming platform built with React, TypeScript, and Express.js. Features a Netflix-like interface with dark theme, TMDB integration, and multiple streaming server support.

## Features

- 🎬 Browse movies and TV shows with TMDB API integration
- 🔍 Real-time search functionality
- 📝 Personal watchlist management
- 🎥 Multiple streaming servers (Vidsrc, Vipstream)
- 🌙 Dark theme with Poppins font
- 📱 Responsive design for all devices
- ⚡ Fast loading with modern React architecture

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **API**: The Movie Database (TMDB)
- **UI**: Radix UI + shadcn/ui components

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   ```bash
   echo "TMDB_API_KEY=your_tmdb_api_key_here" > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5000 in your browser

## Deployment to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the project**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard:
   - `TMDB_API_KEY`: Your TMDB API key
   - `NODE_ENV`: production

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TMDB_API_KEY` | The Movie Database API key | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Optional* |

*Uses in-memory storage in development, PostgreSQL in production

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage
├── shared/                 # Shared types
└── api/                   # Vercel serverless functions
```

## API Integration

The application integrates with TMDB (The Movie Database) for authentic movie and TV show data. Get your free API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

## License

MIT License - feel free to use this project for personal or commercial purposes.