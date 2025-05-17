
import { useState } from 'react';
import { AudioTrack, AudioPlaylist } from '@/types/audio';

export const useMusicPlaylist = () => {
  const [playlists, setPlaylists] = useState<AudioPlaylist[]>([
    {
      id: "relax",
      title: "Relaxation",
      description: "Calming tracks for relaxation",
      tracks: [
        {
          id: "track1",
          title: "Ocean Waves",
          artist: "Nature Sounds",
          duration: 180,
          url: "/audio/ocean-waves.mp3",
          coverUrl: "/images/ocean.jpg"
        },
        {
          id: "track2",
          title: "Gentle Rain",
          artist: "Nature Sounds",
          duration: 240,
          url: "/audio/gentle-rain.mp3",
          coverUrl: "/images/rain.jpg"
        },
        {
          id: "track3",
          title: "Forest Ambience",
          artist: "Nature Sounds",
          duration: 300,
          url: "/audio/forest-ambience.mp3",
          coverUrl: "/images/forest.jpg"
        }
      ]
    },
    {
      id: "focus",
      title: "Focus",
      description: "Tracks to help with concentration",
      tracks: [
        {
          id: "track4",
          title: "Deep Focus",
          artist: "Concentration Music",
          duration: 360,
          url: "/audio/deep-focus.mp3",
          coverUrl: "/images/focus.jpg"
        },
        {
          id: "track5",
          title: "Study Session",
          artist: "Concentration Music",
          duration: 420,
          url: "/audio/study-session.mp3",
          coverUrl: "/images/study.jpg"
        },
        {
          id: "track6",
          title: "Ambient Work",
          artist: "Concentration Music",
          duration: 480,
          url: "/audio/ambient-work.mp3",
          coverUrl: "/images/work.jpg"
        }
      ]
    }
  ]);

  // Function to add a new playlist
  const addPlaylist = (newPlaylist: AudioPlaylist) => {
    setPlaylists([...playlists, newPlaylist]);
  };

  // Function to remove a playlist by ID
  const removePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  // Function to update a playlist
  const updatePlaylist = (updatedPlaylist: AudioPlaylist) => {
    setPlaylists(
      playlists.map(playlist =>
        playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
      )
    );
  };

  return {
    playlists,
    addPlaylist,
    removePlaylist,
    updatePlaylist
  };
};

export default useMusicPlaylist;
