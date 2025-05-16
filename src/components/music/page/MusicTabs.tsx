import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { MusicTrack } from '@/types/music';

const MusicTabs = () => {
  // Example tracks adapted to the MusicTrack interface
  const tracksWithAudioUrl: MusicTrack[] = [
    {
      id: "1",
      title: "Calm Morning",
      artist: "Ambient Dreams",
      duration: 180,
      audioUrl: "/sample-audio/calm-1.mp3",
      coverUrl: "/images/music/calm-1.jpg",
      url: "/sample-audio/calm-1.mp3",
      category: "calm"
    },
    {
      id: "2",
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: 240,
      audioUrl: "/sample-audio/calm-2.mp3",
      coverUrl: "/images/music/calm-2.jpg",
      url: "/sample-audio/calm-2.mp3",
      category: "calm"
    }
  ];

  return (
    <TabsContent value="library">
      {/* Display tracks with audioUrl */}
      {tracksWithAudioUrl.map((track) => (
        <div key={track.id}>
          <h3>{track.title}</h3>
          <p>Artist: {track.artist}</p>
          <audio controls src={track.audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </TabsContent>
  );
};

export default MusicTabs;
