import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import ContentGrid from "@/components/content-grid";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Movie, TvShow } from "@shared/schema";

export default function Home() {
  const { data: movies, isLoading: moviesLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const { data: tvShows, isLoading: tvShowsLoading } = useQuery<TvShow[]>({
    queryKey: ["/api/tv"],
  });

  const { data: watchlist, isLoading: watchlistLoading } = useQuery<any[]>({
    queryKey: ["/api/watchlist"],
  });

  const featuredMovie = movies?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-[70vh] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: featuredMovie.backdropPath 
                ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdropPath})`
                : 'linear-gradient(45deg, hsl(187, 79%, 56%), hsl(262, 100%, 44%))',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-title">
                {featuredMovie.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3" data-testid="text-hero-description">
                {featuredMovie.overview}
              </p>
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/player/movie/${featuredMovie.tmdbId}`}
                  data-testid="button-play-hero"
                >
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    <Play className="mr-2 h-5 w-5" />
                    Play
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-600 hover:border-primary"
                  data-testid="button-add-watchlist-hero"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  My List
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Popular Movies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" data-testid="text-popular-movies-title">
            Popular Movies
          </h2>
          {moviesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ContentGrid items={movies || []} type="movie" />
          )}
        </section>

        {/* Popular TV Shows */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" data-testid="text-popular-tv-title">
            Popular TV Shows
          </h2>
          {tvShowsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ContentGrid items={tvShows || []} type="tv" />
          )}
        </section>

        {/* Watchlist */}
        {watchlist && watchlist.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" data-testid="text-watchlist-title">
              My Watchlist
            </h2>
            {watchlistLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {watchlist.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="group bg-card rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                    data-testid={`card-watchlist-${item.id}`}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={
                          item.content.backdropPath
                            ? `https://image.tmdb.org/t/p/w500${item.content.backdropPath}`
                            : "/placeholder-backdrop.jpg"
                        }
                        alt={item.content.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
                      <Button
                        size="icon"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        data-testid={`button-play-watchlist-${item.id}`}
                      >
                        <Play className="ml-1" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2" data-testid={`text-watchlist-title-${item.id}`}>
                        {item.content.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {item.contentType === "movie" 
                          ? `${item.content.releaseDate?.split("-")[0]} • Movie`
                          : `${item.content.firstAirDate?.split("-")[0]} • TV Show`
                        }
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                            {item.content.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
