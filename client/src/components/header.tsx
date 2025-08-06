import { useState } from "react";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Movie, TvShow } from "@shared/schema";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: searchResults } = useQuery<{ movies: Movie[], tvShows: TvShow[] }>({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, just log the search - you could navigate to a search results page
      console.log("Search query:", searchQuery);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-logo">
              <div className="gradient-overlay text-white font-bold text-2xl px-4 py-2 rounded-lg">
                Maruya
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className="text-white hover:text-primary transition-colors"
                data-testid="link-movies"
              >
                Movies
              </Link>
              <Link 
                href="/" 
                className="text-white hover:text-primary transition-colors"
                data-testid="link-tv-shows"
              >
                TV Shows
              </Link>
              <Link 
                href="/" 
                className="text-white hover:text-primary transition-colors"
                data-testid="link-my-list"
              >
                My List
              </Link>
              <Link 
                href="/" 
                className="text-white hover:text-primary transition-colors"
                data-testid="link-browse"
              >
                Browse
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search movies, shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface border-border rounded-full px-4 py-2 pl-10 w-64 focus:border-primary"
                  data-testid="input-search"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </form>
              
              {/* Search Results Dropdown */}
              {searchResults && searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.movies?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Movies</h3>
                      {searchResults.movies.slice(0, 3).map((movie: any) => (
                        <Link
                          key={movie.id}
                          href={`/player/movie/${movie.tmdbId}`}
                          className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg"
                          data-testid={`search-result-movie-${movie.id}`}
                        >
                          <img
                            src={
                              movie.posterPath
                                ? `https://image.tmdb.org/t/p/w92${movie.posterPath}`
                                : "/placeholder-poster.jpg"
                            }
                            alt={movie.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{movie.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {movie.releaseDate?.split("-")[0]} • Movie
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.tvShows?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">TV Shows</h3>
                      {searchResults.tvShows.slice(0, 3).map((show: any) => (
                        <Link
                          key={show.id}
                          href={`/player/tv/${show.tmdbId}`}
                          className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg"
                          data-testid={`search-result-tv-${show.id}`}
                        >
                          <img
                            src={
                              show.posterPath
                                ? `https://image.tmdb.org/t/p/w92${show.posterPath}`
                                : "/placeholder-poster.jpg"
                            }
                            alt={show.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{show.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {show.firstAirDate?.split("-")[0]} • TV Show
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {(!searchResults.movies?.length && !searchResults.tvShows?.length) && (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-surface"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
