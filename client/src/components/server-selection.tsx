import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle } from "lucide-react";

interface Server {
  name: string;
  url: string;
  quality: string;
}

interface ServerSelectionProps {
  servers: Server[];
  defaultServer?: Server;
  isLoading: boolean;
}

export default function ServerSelection({ servers, defaultServer, isLoading }: ServerSelectionProps) {
  const [selectedServer, setSelectedServer] = useState<Server | null>(defaultServer || null);
  const [quality, setQuality] = useState("Auto (1080p)");
  const [playbackSpeed, setPlaybackSpeed] = useState("1x (Normal)");

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server);
    // Emit server change event that VideoPlayer can listen to
    window.dispatchEvent(new CustomEvent('serverChange', { detail: server }));
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Server Selection</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full bg-muted p-3 rounded-lg animate-pulse h-12"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 mb-6" data-testid="server-selection-container">
      <h3 className="text-xl font-semibold mb-4">Server Selection</h3>
      <div className="space-y-3">
        {servers.map((server, index) => (
          <Button
            key={index}
            onClick={() => handleServerSelect(server)}
            className={`w-full p-3 rounded-lg font-semibold flex items-center justify-between transition-all ${
              selectedServer?.url === server.url
                ? "bg-primary text-black hover:bg-primary/80"
                : "bg-muted text-white hover:bg-muted/80"
            }`}
            data-testid={`button-server-${index}`}
          >
            <div className="flex items-center space-x-3">
              <PlayCircle className="h-5 w-5" />
              <span>{server.name}</span>
            </div>
            <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
              {server.quality}
            </span>
          </Button>
        ))}
      </div>
      
      {/* Quality Selection */}
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Quality</h4>
        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger className="w-full bg-muted border-border" data-testid="select-quality">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Auto (1080p)">Auto (1080p)</SelectItem>
            <SelectItem value="4K (2160p)">4K (2160p)</SelectItem>
            <SelectItem value="1080p">1080p</SelectItem>
            <SelectItem value="720p">720p</SelectItem>
            <SelectItem value="480p">480p</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Speed Selection */}
      <div className="mt-4">
        <h4 className="font-semibold mb-3">Playback Speed</h4>
        <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
          <SelectTrigger className="w-full bg-muted border-border" data-testid="select-speed">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5x">0.5x</SelectItem>
            <SelectItem value="0.75x">0.75x</SelectItem>
            <SelectItem value="1x (Normal)">1x (Normal)</SelectItem>
            <SelectItem value="1.25x">1.25x</SelectItem>
            <SelectItem value="1.5x">1.5x</SelectItem>
            <SelectItem value="2x">2x</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
