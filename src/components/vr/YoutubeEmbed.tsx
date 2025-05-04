
import React from 'react';

interface YoutubeEmbedProps {
  embedId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId }) => {
  if (!embedId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
        <p className="text-gray-500">Video unavailable</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${embedId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
