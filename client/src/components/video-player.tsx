import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Server {
  name: string;
  url: string;
  quality: string;
}

interface VideoPlayerProps {
  servers: Server[];
  defaultServer?: Server;
  isLoading: boolean;
}

export default function VideoPlayer({ servers, defaultServer, isLoading }: VideoPlayerProps) {
  const [currentServer, setCurrentServer] = useState<Server | null>(defaultServer || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (defaultServer && !currentServer) {
      setCurrentServer(defaultServer);
    }
  }, [defaultServer, currentServer]);

  const handleServerChange = (server: Server) => {
    setLoading(true);
    setError(false);
    setCurrentServer(server);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleRetry = () => {
    if (currentServer) {
      setError(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="relative bg-black aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading servers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black" data-testid="video-player-container">
      <div className="aspect-video relative overflow-hidden">
        {/* Video Frame */}
        {currentServer && !loading && !error && (
          <iframe
            key={currentServer.url}
            src={currentServer.url}
            className="w-full h-full"
            referrerPolicy="origin"
            allowFullScreen
            data-testid="video-iframe"
          />
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center" data-testid="loading-overlay">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-black flex items-center justify-center" data-testid="error-overlay">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to load video</h3>
              <p className="text-muted-foreground mb-4">Please try a different server or check your connection</p>
              <Button 
                onClick={handleRetry}
                className="bg-primary text-black hover:bg-primary/80"
                data-testid="button-retry"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Server Selected */}
        {!currentServer && !loading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">No server selected</h3>
              <p className="text-muted-foreground">Please select a server from the sidebar to start watching</p>
            </div>
          </div>
        )}

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 video-controls p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-4 mb-4">
            {/* Progress Bar */}
            <div className="flex-1 bg-gray-600 h-1 rounded-full cursor-pointer">
              <div className="bg-primary h-full w-1/3 rounded-full relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">45:32 / 2:13:45</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                size="icon"
                className="w-12 h-12 bg-white text-black rounded-full hover:bg-gray-200"
                data-testid="button-play-pause"
              >
                <i className="fas fa-play text-lg"></i>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-2xl hover:text-primary"
                data-testid="button-volume"
              >
                <i className="fas fa-volume-up"></i>
              </Button>
              <div className="w-24 bg-gray-600 h-1 rounded-full">
                <div className="bg-white h-full w-3/4 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary"
                data-testid="button-captions"
              >
                <i className="fas fa-closed-captioning"></i>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary"
                data-testid="button-settings"
              >
                <i className="fas fa-cog"></i>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-xl hover:text-primary"
                data-testid="button-fullscreen"
              >
                <i className="fas fa-expand"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
