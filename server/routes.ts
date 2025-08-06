import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertTvShowSchema, insertWatchlistSchema } from "@shared/schema";
import { z } from "zod";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY || "";
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
    studio: tmdbShow.production_companies?.[0]?.name || null,
    language: tmdbShow.original_language || "en",
    country: tmdbShow.origin_country?.[0] || "US",
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Search content
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter required" });
      }

      // Search TMDb
      const tmdbResults = await fetchFromTMDB(`/search/multi&query=${encodeURIComponent(q)}`);
      
      const results = {
        movies: [],
        tvShows: [],
      };

      for (const item of tmdbResults.results.slice(0, 10)) {
        if (item.media_type === "movie") {
          const movieDetails = await fetchFromTMDB(`/movie/${item.id}`);
          const transformedMovie = transformTMDBMovie(movieDetails);
          
          let movie = await storage.getMovieByTmdbId(item.id);
          if (!movie) {
            movie = await storage.createMovie(transformedMovie);
          }
          (results.movies as any[]).push(movie);
        } else if (item.media_type === "tv") {
          const showDetails = await fetchFromTMDB(`/tv/${item.id}`);
          const transformedShow = transformTMDBTvShow(showDetails);
          
          let tvShow = await storage.getTvShowByTmdbId(item.id);
          if (!tvShow) {
            tvShow = await storage.createTvShow(transformedShow);
          }
          (results.tvShows as any[]).push(tvShow);
        }
      }

      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Search failed" });
    }
  });

  // Get movie details
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      let movie = await storage.getMovie(id);
      if (!movie) {
        // Try to fetch from TMDb if it's a TMDb ID
        const tmdbId = parseInt(id);
        if (!isNaN(tmdbId)) {
          movie = await storage.getMovieByTmdbId(tmdbId);
          if (!movie) {
            const tmdbMovie = await fetchFromTMDB(`/movie/${tmdbId}`);
            const transformedMovie = transformTMDBMovie(tmdbMovie);
            movie = await storage.createMovie(transformedMovie);
          }
        }
      }
      
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.json(movie);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get movie" });
    }
  });

  // Get TV show details
  app.get("/api/tv/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      let tvShow = await storage.getTvShow(id);
      if (!tvShow) {
        // Try to fetch from TMDb if it's a TMDb ID
        const tmdbId = parseInt(id);
        if (!isNaN(tmdbId)) {
          tvShow = await storage.getTvShowByTmdbId(tmdbId);
          if (!tvShow) {
            const tmdbShow = await fetchFromTMDB(`/tv/${tmdbId}`);
            const transformedShow = transformTMDBTvShow(tmdbShow);
            tvShow = await storage.createTvShow(transformedShow);
          }
        }
      }
      
      if (!tvShow) {
        return res.status(404).json({ message: "TV show not found" });
      }

      res.json(tvShow);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get TV show" });
    }
  });

  // Get popular movies
  app.get("/api/movies", async (req, res) => {
    try {
      // Fetch popular movies from TMDb
      const tmdbMovies = await fetchFromTMDB("/movie/popular");
      
      const movies = [];
      for (const tmdbMovie of tmdbMovies.results.slice(0, 20)) {
        let movie = await storage.getMovieByTmdbId(tmdbMovie.id);
        if (!movie) {
          const movieDetails = await fetchFromTMDB(`/movie/${tmdbMovie.id}`);
          const transformedMovie = transformTMDBMovie(movieDetails);
          movie = await storage.createMovie(transformedMovie);
        }
        movies.push(movie);
      }

      res.json(movies);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get movies" });
    }
  });

  // Get popular TV shows
  app.get("/api/tv", async (req, res) => {
    try {
      // Fetch popular TV shows from TMDb
      const tmdbShows = await fetchFromTMDB("/tv/popular");
      
      const tvShows = [];
      for (const tmdbShow of tmdbShows.results.slice(0, 20)) {
        let tvShow = await storage.getTvShowByTmdbId(tmdbShow.id);
        if (!tvShow) {
          const showDetails = await fetchFromTMDB(`/tv/${tmdbShow.id}`);
          const transformedShow = transformTMDBTvShow(showDetails);
          tvShow = await storage.createTvShow(transformedShow);
        }
        tvShows.push(tvShow);
      }

      res.json(tvShows);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get TV shows" });
    }
  });

  // Get streaming servers for content
  app.get("/api/servers", async (req, res) => {
    try {
      const { video_id, type, season, episode } = req.query;
      
      if (!video_id) {
        return res.status(400).json({ message: "video_id is required" });
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

      res.json({ servers, defaultServer: servers[0] });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get servers" });
    }
  });

  // Watchlist endpoints
  app.get("/api/watchlist", async (req, res) => {
    try {
      // For demo, use a default user ID
      const userId = "default-user";
      const watchlistItems = await storage.getWatchlist(userId);
      
      const populatedItems = [];
      for (const item of watchlistItems) {
        if (item.contentType === "movie") {
          const movie = await storage.getMovie(item.contentId);
          if (movie) {
            populatedItems.push({ ...item, content: movie });
          }
        } else if (item.contentType === "tv") {
          const tvShow = await storage.getTvShow(item.contentId);
          if (tvShow) {
            populatedItems.push({ ...item, content: tvShow });
          }
        }
      }
      
      res.json(populatedItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to get watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const validatedData = insertWatchlistSchema.parse({
        ...req.body,
        userId: "default-user" // For demo
      });
      
      const item = await storage.addToWatchlist(validatedData);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      const userId = "default-user"; // For demo
      
      const removed = await storage.removeFromWatchlist(userId, contentId);
      if (!removed) {
        return res.status(404).json({ message: "Item not found in watchlist" });
      }
      
      res.json({ message: "Removed from watchlist" });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to remove from watchlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
