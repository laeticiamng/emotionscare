import React from 'react';

export interface YoutubeEmbedProps {
  videoUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  showInfo?: boolean;
  mute?: boolean; // Changed from muted to mute
  className?: string;
  startAt?: number;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
  videoUrl,
  autoplay = false,
  loop = false,
  controls = true,
  showInfo = true,
  mute = false, // Changed from muted to mute
  className = '',
  startAt = 0
}) => {
  // Extract video ID from URL
  const getYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYoutubeId(videoUrl);
  
  if (!videoId) {
    return <div className="text-red-500 p-4">URL YouTube invalide</div>;
  }

  // Build embed URL with parameters
  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
  if (autoplay) embedUrl += 'autoplay=1&';
  if (mute) embedUrl += 'mute=1&'; // Changed from muted to mute
  if (!showInfo) embedUrl += 'showinfo=0&';
  if (!controls) embedUrl += 'controls=0&';
  if (loop) embedUrl += 'loop=1&playlist=' + videoId + '&';
  if (startAt > 0) embedUrl += `start=${startAt}&`;

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
