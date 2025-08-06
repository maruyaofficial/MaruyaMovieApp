import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

// Import storage and route handlers
const app = new Hono();

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint: string) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key not configured");
  }
  
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }
  return response.json();
}

function transformTMDBMovie(tmdbMovie: any) {
  return {
    id: `movie-${tmdbMovie.id}`,
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    runtime: tmdbMovie.runtime || null,
    rating: tmdbMovie.vote_average,
    genres: tmdbMovie.genres?.map((g: any) => g.name) || [],
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    cast: [],
    director: null,
    studio: tmdbMovie.production_companies?.[0]?.name || null,
    language: tmdbMovie.original_language || "en",
    country: tmdbMovie.production_countries?.[0]?.name || "US",
  };
}

function transformTMDBTvShow(tmdbShow: any) {
  return {
    id: `tv-${tmdbShow.id}`,
    tmdbId: tmdbShow.id,
    title: tmdbShow.name,
    overview: tmdbShow.overview,
    firstAirDate: tmdbShow.first_air_date,
    lastAirDate: tmdbShow.last_air_date,
    numberOfSeasons: tmdbShow.number_of_seasons || 1,
    numberOfEpisodes: tmdbShow.number_of_episodes || 1,
    rating: tmdbShow.vote_average,
    genres: tmdbShow.genres?.map((g: any) => g.name) || [],
    posterPath: tmdbShow.poster_path,
    backdropPath: tmdbShow.backdrop_path,
    cast: [],
    creator: tmdbShow.created_by?.[0]?.name || null,
    network: tmdbShow.networks?.[0]?.name || null,
    status: tmdbShow.status || "Unknown",
    language: tmdbShow.original_language || "en",
    country: tmdbShow.origin_country?.[0] || "US",
  };
}

// Search movies and TV shows
app.get('/search', async (c) => {
  try {
    const query = c.req.query('q');
    if (!query) {
      return c.json({ message: "Query parameter 'q' is required" }, 400);
    }

    const [movieResults, tvResults] = await Promise.all([
      fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`),
      fetchFromTMDB(`/search/tv?query=${encodeURIComponent(query)}`)
    ]);

    const movies = movieResults.results.slice(0, 10).map(transformTMDBMovie);
    const tvShows = tvResults.results.slice(0, 10).map(transformTMDBTvShow);

    return c.json({
      movies,
      tvShows,
      total: movies.length + tvShows.length
    });
  } catch (error: any) {
    return c.json({ message: error.message || "Search failed" }, 500);
  }
});

// Get popular movies
app.get('/movies', async (c) => {
  try {
    const tmdbMovies = await fetchFromTMDB("/movie/popular");
    const movies = tmdbMovies.results.slice(0, 20).map(transformTMDBMovie);
    return c.json(movies);
  } catch (error: any) {
    return c.json({ message: error.message || "Failed to get movies" }, 500);
  }
});

// Get popular TV shows
app.get('/tv', async (c) => {
  try {
    const tmdbShows = await fetchFromTMDB("/tv/popular");
    const tvShows = tmdbShows.results.slice(0, 20).map(transformTMDBTvShow);
    return c.json(tvShows);
  } catch (error: any) {
    return c.json({ message: error.message || "Failed to get TV shows" }, 500);
  }
});

// Get movie details
app.get('/movie/:id', async (c) => {
  try {
    const tmdbId = c.req.param('id');
    const movieDetails = await fetchFromTMDB(`/movie/${tmdbId}`);
    const movie = transformTMDBMovie(movieDetails);
    return c.json(movie);
  } catch (error: any) {
    return c.json({ message: error.message || "Movie not found" }, 404);
  }
});

// Get TV show details  
app.get('/tv/:id', async (c) => {
  try {
    const tmdbId = c.req.param('id');
    const showDetails = await fetchFromTMDB(`/tv/${tmdbId}`);
    const tvShow = transformTMDBTvShow(showDetails);
    return c.json(tvShow);
  } catch (error: any) {
    return c.json({ message: error.message || "TV show not found" }, 404);
  }
});

// Get streaming servers
app.get('/servers', async (c) => {
  try {
    const video_id = c.req.query('video_id');
    const type = c.req.query('type');
    const season = c.req.query('season');
    const episode = c.req.query('episode');
    
    if (!video_id) {
      return c.json({ message: "video_id is required" }, 400);
    }

    const isTV = type === "tv" && season && episode;
    
    const servers = [
      {
        name: "Vidsrc",
        url: isTV 
          ? `https://vidsrc.net/embed/tv/${video_id}/${season}/${episode}`
          : `https://vidsrc.net/embed/movie/${video_id}`,
        quality: "HD"
      },
      {
        name: "Vipstream", 
        url: isTV
          ? `https://vipstream.tv/embed-2/tv?tmdb=${video_id}&season=${season}&episode=${episode}`
          : `https://vipstream.tv/embed-2/movie?tmdb=${video_id}`,
        quality: "4K"
      }
    ];

    return c.json({ servers, defaultServer: servers[0] });
  } catch (error: any) {
    return c.json({ message: error.message || "Failed to get servers" }, 500);
  }
});

// Watchlist endpoints (using local storage simulation)
app.get('/watchlist', async (c) => {
  return c.json([]);
});

app.post('/watchlist', async (c) => {
  try {
    const body = await c.req.json();
    return c.json({ 
      id: `watchlist-${Date.now()}`,
      ...body,
      addedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({ message: error.message || "Failed to add to watchlist" }, 500);
  }
});

app.delete('/watchlist/:id', async (c) => {
  return c.json({ success: true });
});

export const onRequest = handle(app);