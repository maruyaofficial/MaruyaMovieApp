import { type User, type InsertUser, type Movie, type InsertMovie, type TvShow, type InsertTvShow, type Episode, type InsertEpisode, type WatchlistItem, type InsertWatchlist } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Movie methods
  getMovie(id: string): Promise<Movie | undefined>;
  getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  searchMovies(query: string): Promise<Movie[]>;
  getPopularMovies(): Promise<Movie[]>;

  // TV Show methods
  getTvShow(id: string): Promise<TvShow | undefined>;
  getTvShowByTmdbId(tmdbId: number): Promise<TvShow | undefined>;
  createTvShow(tvShow: InsertTvShow): Promise<TvShow>;
  searchTvShows(query: string): Promise<TvShow[]>;
  getPopularTvShows(): Promise<TvShow[]>;

  // Episode methods
  getEpisode(id: string): Promise<Episode | undefined>;
  getEpisodesByTvShow(tvShowId: string): Promise<Episode[]>;
  getEpisodeBySeasonAndNumber(tvShowId: string, season: number, episode: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;

  // Watchlist methods
  getWatchlist(userId: string): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlist): Promise<WatchlistItem>;
  removeFromWatchlist(userId: string, contentId: string): Promise<boolean>;
  isInWatchlist(userId: string, contentId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private movies: Map<string, Movie>;
  private tvShows: Map<string, TvShow>;
  private episodes: Map<string, Episode>;
  private watchlist: Map<string, WatchlistItem>;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.tvShows = new Map();
    this.episodes = new Map();
    this.watchlist = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId,
    );
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = { 
      ...insertMovie, 
      id,
      tmdbId: insertMovie.tmdbId ?? 0,
      overview: insertMovie.overview ?? null,
      releaseDate: insertMovie.releaseDate ?? null,
      runtime: insertMovie.runtime ?? null,
      rating: insertMovie.rating ?? null,
      genres: Array.isArray(insertMovie.genres) ? insertMovie.genres : [],
      posterPath: insertMovie.posterPath ?? null,
      backdropPath: insertMovie.backdropPath ?? null,
      cast: Array.isArray(insertMovie.cast) ? insertMovie.cast : [],
      director: insertMovie.director ?? null,
      studio: insertMovie.studio ?? null,
      language: insertMovie.language ?? "en",
      country: insertMovie.country ?? "US"
    };
    this.movies.set(id, movie);
    return movie;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.movies.values()).filter(
      (movie) => movie.title.toLowerCase().includes(lowercaseQuery),
    );
  }

  async getPopularMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);
  }

  async getTvShow(id: string): Promise<TvShow | undefined> {
    return this.tvShows.get(id);
  }

  async getTvShowByTmdbId(tmdbId: number): Promise<TvShow | undefined> {
    return Array.from(this.tvShows.values()).find(
      (show) => show.tmdbId === tmdbId,
    );
  }

  async createTvShow(insertTvShow: InsertTvShow): Promise<TvShow> {
    const id = randomUUID();
    const tvShow: TvShow = { 
      ...insertTvShow, 
      id,
      tmdbId: insertTvShow.tmdbId ?? 0,
      overview: insertTvShow.overview ?? null,
      firstAirDate: insertTvShow.firstAirDate ?? null,
      lastAirDate: insertTvShow.lastAirDate ?? null,
      numberOfSeasons: insertTvShow.numberOfSeasons ?? 1,
      numberOfEpisodes: insertTvShow.numberOfEpisodes ?? 1,
      rating: insertTvShow.rating ?? null,
      genres: Array.isArray(insertTvShow.genres) ? insertTvShow.genres : [],
      posterPath: insertTvShow.posterPath ?? null,
      backdropPath: insertTvShow.backdropPath ?? null,
      cast: Array.isArray(insertTvShow.cast) ? insertTvShow.cast : [],
      creator: insertTvShow.creator ?? null,
      studio: insertTvShow.studio ?? null,
      language: insertTvShow.language ?? "en",
      country: insertTvShow.country ?? "US"
    };
    this.tvShows.set(id, tvShow);
    return tvShow;
  }

  async searchTvShows(query: string): Promise<TvShow[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tvShows.values()).filter(
      (show) => show.title.toLowerCase().includes(lowercaseQuery),
    );
  }

  async getPopularTvShows(): Promise<TvShow[]> {
    return Array.from(this.tvShows.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);
  }

  async getEpisode(id: string): Promise<Episode | undefined> {
    return this.episodes.get(id);
  }

  async getEpisodesByTvShow(tvShowId: string): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(
      (episode) => episode.tvShowId === tvShowId,
    );
  }

  async getEpisodeBySeasonAndNumber(tvShowId: string, season: number, episode: number): Promise<Episode | undefined> {
    return Array.from(this.episodes.values()).find(
      (ep) => ep.tvShowId === tvShowId && ep.seasonNumber === season && ep.episodeNumber === episode,
    );
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = randomUUID();
    const episode: Episode = { 
      ...insertEpisode, 
      id,
      tvShowId: insertEpisode.tvShowId ?? "",
      overview: insertEpisode.overview ?? null,
      airDate: insertEpisode.airDate ?? null,
      runtime: insertEpisode.runtime ?? null,
      rating: insertEpisode.rating ?? null,
      stillPath: insertEpisode.stillPath ?? null
    };
    this.episodes.set(id, episode);
    return episode;
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<WatchlistItem> {
    const id = randomUUID();
    const item: WatchlistItem = { 
      ...insertWatchlist, 
      id,
      addedAt: new Date().toISOString(),
    };
    this.watchlist.set(id, item);
    return item;
  }

  async removeFromWatchlist(userId: string, contentId: string): Promise<boolean> {
    const item = Array.from(this.watchlist.values()).find(
      (item) => item.userId === userId && item.contentId === contentId,
    );
    if (item) {
      this.watchlist.delete(item.id);
      return true;
    }
    return false;
  }

  async isInWatchlist(userId: string, contentId: string): Promise<boolean> {
    return Array.from(this.watchlist.values()).some(
      (item) => item.userId === userId && item.contentId === contentId,
    );
  }
}

export const storage = new MemStorage();
