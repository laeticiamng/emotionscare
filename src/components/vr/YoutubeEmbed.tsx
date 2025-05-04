
import React, { useState } from 'react';
import { extractYoutubeID, buildYoutubeEmbedUrl } from '@/utils/vrUtils';

interface YoutubeEmbedProps {
  embedId?: string;
  videoUrl?: string;
  autoplay?: boolean;
  controls?: boolean;
  mute?: boolean;
  loop?: boolean;
  showInfo?: boolean;
  className?: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ 
  embedId, 
  videoUrl,
  autoplay = false,
  controls = true,
  mute = false,
  loop = false,
  showInfo = true,
  className = ''
}) => {
  // Get video ID from either embedId prop or extract from videoUrl
  const videoId = embedId || (videoUrl ? extractYoutubeID(videoUrl) : '');

  // Handle loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  if (!videoId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
        <p className="text-gray-500">Video unavailable</p>
      </div>
    );
  }
  
  // Build the YouTube embed URL with all parameters
  const embedUrl = buildYoutubeEmbedUrl(videoId, {
    autoplay,
    controls,
    mute,
    loop,
    showInfo,
    rel: false,
  });

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <iframe
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      ></iframe>
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Error loading video</p>
        </div>
      )}
    </div>
  );
};

export default YoutubeEmbed;
