// @ts-nocheck
import React, { useEffect, useState } from 'react';

interface NowPlayingA11yProps {
  title: string;
  playing: boolean;
}

export const NowPlayingA11y: React.FC<NowPlayingA11yProps> = ({
  title,
  playing
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (title) {
      const status = playing ? 'en cours' : 'en pause';
      setAnnouncement(`${title} - ${status}`);
    } else {
      setAnnouncement('');
    }
  }, [title, playing]);

  // Clear announcement after it's been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  );
};