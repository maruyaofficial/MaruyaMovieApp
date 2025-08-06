import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, ThumbsUp, Share, Heart } from "lucide-react";
import type { Movie, TvShow } from "@shared/schema";

interface VideoInfoProps {
  content: Movie | TvShow;
  type: "movie" | "tv";
  onAddToWatchlist: () => void;
  onRemoveFromWatchlist: () => void;
  addingToWatchlist: boolean;
  removingFromWatchlist: boolean;
}

export default function VideoInfo({ 
  content, 
  type, 
  onAddToWatchlist, 
  onRemoveFromWatchlist, 
  addingToWatchlist, 
  removingFromWatchlist 
}: VideoInfoProps) {
  
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getYear = (dateString: string | null) => {
    return dateString ? dateString.split("-")[0] : "Unknown";
  };

  return (
    <div className="mb-6" data-testid="video-info-container">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold" data-testid="text-content-title">
          {content.title}
        </h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-yellow-500 text-black">
            {content.rating?.toFixed(1) || "N/A"}
          </Badge>
          <span className="text-muted-foreground">
            {type === "movie" 
              ? `${getYear((content as Movie).releaseDate)} • ${formatRuntime((content as Movie).runtime)} • Movie`
              : `${getYear((content as TvShow).firstAirDate)} • ${(content as TvShow).numberOfSeasons} Season${(content as TvShow).numberOfSeasons !== 1 ? 's' : ''} • TV Show`
            }
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Button 
          size="lg" 
          className="bg-white text-black hover:bg-gray-200"
          data-testid="button-play"
        >
          <Play className="mr-2 h-5 w-5" />
          Play
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-border hover:border-primary"
          onClick={onAddToWatchlist}
          disabled={addingToWatchlist}
          data-testid="button-add-watchlist"
        >
          <Plus className="mr-2 h-5 w-5" />
          {addingToWatchlist ? "Adding..." : "My List"}
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-border hover:border-primary"
          data-testid="button-like"
        >
          <ThumbsUp className="mr-2 h-5 w-5" />
          Like
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="border-border hover:border-primary"
          data-testid="button-share"
        >
          <Share className="mr-2 h-5 w-5" />
          Share
        </Button>
      </div>
      
      {/* Description */}
      <p className="text-gray-300 text-lg leading-relaxed mb-6" data-testid="text-content-description">
        {content.overview || "No description available."}
      </p>

      {/* Genres */}
      {content.genres && content.genres.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {content.genres.map((genre) => (
              <Badge key={genre} variant="outline" data-testid={`badge-genre-${genre}`}>
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Cast & Crew */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Cast</h3>
          {content.cast && content.cast.length > 0 ? (
            <div className="space-y-2">
              {content.cast.slice(0, 3).map((castMember, index) => (
                <div key={index} className="flex items-center space-x-3" data-testid={`cast-member-${index}`}>
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {castMember.profilePath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${castMember.profilePath}`}
                        alt={castMember.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-medium">
                        {castMember.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{castMember.name}</p>
                    <p className="text-muted-foreground text-sm">{castMember.character}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Cast information not available</p>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Details</h3>
          <div className="space-y-2 text-muted-foreground">
            {type === "movie" ? (
              <>
                {"director" in content && content.director && (
                  <p data-testid="text-director">
                    <span className="text-white">Director:</span> {content.director}
                  </p>
                )}
              </>
            ) : (
              <>
                {"creator" in content && content.creator && (
                  <p data-testid="text-creator">
                    <span className="text-white">Creator:</span> {content.creator}
                  </p>
                )}
              </>
            )}
            {content.studio && (
              <p data-testid="text-studio">
                <span className="text-white">Studio:</span> {content.studio}
              </p>
            )}
            <p data-testid="text-language">
              <span className="text-white">Language:</span> {content.language?.toUpperCase() || "Unknown"}
            </p>
            <p data-testid="text-country">
              <span className="text-white">Country:</span> {content.country || "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
