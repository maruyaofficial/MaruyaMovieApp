import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "wouter";
import type { Movie, TvShow } from "@shared/schema";

interface ContentGridProps {
  items: (Movie | TvShow)[];
  type: "movie" | "tv";
}

export default function ContentGrid({ items, type }: ContentGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" data-testid="content-grid">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/player/${type}/${item.tmdbId}`}
          className="group cursor-pointer"
          data-testid={`content-item-${item.id}`}
        >
          <div className="aspect-[2/3] relative overflow-hidden rounded-lg mb-3">
            <img
              src={
                item.posterPath
                  ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                  : "/placeholder-poster.jpg"
              }
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <Button
              size="icon"
              className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              data-testid={`button-play-${item.id}`}
            >
              <Play className="w-4 h-4 text-white" />
            </Button>
          </div>
          <h3 className="font-medium text-sm mb-1 line-clamp-2" data-testid={`text-title-${item.id}`}>
            {item.title}
          </h3>
          <p className="text-muted-foreground text-xs" data-testid={`text-details-${item.id}`}>
            {type === "movie" 
              ? `${(item as Movie).releaseDate?.split("-")[0] || "Unknown"} • Movie`
              : `${(item as TvShow).firstAirDate?.split("-")[0] || "Unknown"} • TV Show`
            }
          </p>
        </Link>
      ))}
    </div>
  );
}
