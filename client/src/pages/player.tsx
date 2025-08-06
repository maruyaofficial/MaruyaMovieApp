import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import VideoPlayer from "@/components/video-player";
import ServerSelection from "@/components/server-selection";
import VideoInfo from "@/components/video-info";
import ContentGrid from "@/components/content-grid";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Movie, TvShow } from "@shared/schema";

interface PlayerParams {
  type: "movie" | "tv";
  id: string;
  season?: string;
  episode?: string;
}

export default function Player() {
  const params = useParams<PlayerParams>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { type, id, season, episode } = params;

  // Fetch content details
  const { data: content, isLoading: contentLoading } = useQuery<Movie | TvShow>({
    queryKey: [`/api/${type}`, id],
  });

  // Fetch streaming servers
  const { data: serversData, isLoading: serversLoading } = useQuery<any>({
    queryKey: ["/api/servers", { video_id: id, type, season, episode }],
    enabled: !!id,
  });

  // Fetch recommendations
  const { data: recommendations } = useQuery<(Movie | TvShow)[]>({
    queryKey: [`/api/${type}`],
  });

  // Watchlist mutation
  const addToWatchlistMutation = useMutation({
    mutationFn: async (contentData: { contentId: string; contentType: string }) => {
      const response = await apiRequest("POST", "/api/watchlist", contentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "Content has been added to your watchlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist.",
        variant: "destructive",
      });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest("DELETE", `/api/watchlist/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from Watchlist",
        description: "Content has been removed from your watchlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist.",
        variant: "destructive",
      });
    },
  });

  const handleAddToWatchlist = () => {
    if (content) {
      addToWatchlistMutation.mutate({
        contentId: content.id,
        contentType: type,
      });
    }
  };

  const handleRemoveFromWatchlist = () => {
    if (content) {
      removeFromWatchlistMutation.mutate(content.id);
    }
  };

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
            <p className="text-muted-foreground">The requested content could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="pt-16">
        {/* Video Player */}
        <VideoPlayer 
          servers={serversData?.servers || []}
          defaultServer={serversData?.defaultServer}
          isLoading={serversLoading}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Video Info */}
            <div className="lg:col-span-3">
              <VideoInfo 
                content={content}
                type={type}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                addingToWatchlist={addToWatchlistMutation.isPending}
                removingFromWatchlist={removeFromWatchlistMutation.isPending}
              />
            </div>

            {/* Server Selection */}
            <div className="lg:col-span-1">
              <ServerSelection 
                servers={serversData?.servers || []}
                defaultServer={serversData?.defaultServer}
                isLoading={serversLoading}
              />
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6" data-testid="text-recommendations-title">
              More Like This
            </h2>
            <ContentGrid 
              items={recommendations.filter((item: any) => item.id !== content.id).slice(0, 12)} 
              type={type} 
            />
          </section>
        )}
      </div>
    </div>
  );
}
