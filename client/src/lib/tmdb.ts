const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  poster_path: string | null;
  backdrop_path: string | null;
  production_companies: Array<{ name: string }>;
  production_countries: Array<{ name: string }>;
  original_language: string;
}

export interface TMDbTvShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  poster_path: string | null;
  backdrop_path: string | null;
  created_by: Array<{ name: string }>;
  production_companies: Array<{ name: string }>;
  origin_country: string[];
  original_language: string;
}

export interface TMDbSearchResult {
  results: Array<{
    id: number;
    media_type: "movie" | "tv";
    title?: string;
    name?: string;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    poster_path: string | null;
    backdrop_path: string | null;
  }>;
}

class TMDbAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = TMDB_API_KEY;
    this.baseUrl = TMDB_BASE_URL;
  }

  private async request<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error("TMDb API key not configured. Please set VITE_TMDB_API_KEY environment variable.");
    }

    const url = `${this.baseUrl}${endpoint}?api_key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async searchMulti(query: string): Promise<TMDbSearchResult> {
    return this.request<TMDbSearchResult>(`/search/multi&query=${encodeURIComponent(query)}`);
  }

  async getMovie(id: number): Promise<TMDbMovie> {
    return this.request<TMDbMovie>(`/movie/${id}`);
  }

  async getTvShow(id: number): Promise<TMDbTvShow> {
    return this.request<TMDbTvShow>(`/tv/${id}`);
  }

  async getPopularMovies(): Promise<{ results: TMDbMovie[] }> {
    return this.request<{ results: TMDbMovie[] }>("/movie/popular");
  }

  async getPopularTvShows(): Promise<{ results: TMDbTvShow[] }> {
    return this.request<{ results: TMDbTvShow[] }>("/tv/popular");
  }

  async getMovieCredits(id: number) {
    return this.request(`/movie/${id}/credits`);
  }

  async getTvCredits(id: number) {
    return this.request(`/tv/${id}/credits`);
  }
}

export const tmdbApi = new TMDbAPI();
