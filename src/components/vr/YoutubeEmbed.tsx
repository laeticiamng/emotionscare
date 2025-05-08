
import React, { useState } from 'react';
import { extractYoutubeID } from '@/utils/vrUtils';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface YoutubeEmbedProps {
  videoUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  showInfo?: boolean;
  loop?: boolean;
  mute?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
  videoUrl,
  autoplay = false,
  controls = true,
  showInfo = true,
  loop = false,
  mute = false,
  className = '',
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0); // Used to force iframe refresh
  
  const videoId = extractYoutubeID(videoUrl);
  
  if (!videoId) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-muted text-center p-4">
        <p className="text-muted-foreground">URL vidéo invalide ou manquante</p>
      </div>
    );
  }
  
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };
  
  const refreshIframe = () => {
    setIsLoading(true);
    setHasError(false);
    setKey(prevKey => prevKey + 1);
  };
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    autoplay ? 1 : 0
  }&controls=${controls ? 1 : 0}&showinfo=${
    showInfo ? 1 : 0
  }&loop=${loop ? 1 : 0}&rel=0${mute ? '&mute=1' : ''}`;
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-4 text-center">
          <p className="text-muted-foreground mb-4">Erreur de chargement de la vidéo</p>
          <Button onClick={refreshIframe} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      ) : (
        <iframe
          key={key}
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default YoutubeEmbed;
