
import { useState } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import { mockMusicPlaylists } from '@/data/mockMusic';

export const usePlaylistManager = (initialPlaylists = mockMusicPlaylists) => {
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(initialPlaylists);
  
  const normalizeTrack = (track: any): MusicTrack => {
    return {
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      url: track.url,
      audioUrl: track.audioUrl || track.url,
      coverUrl: track.coverUrl,
      emotion: track.emotion,
    };
  };
  
  const getPlaylistById = (id: string) => {
    return playlists.find(playlist => playlist.id === id) || null;
  };
  
  const getPlaylistByEmotion = (emotion: string) => {
    return playlists.find(playlist => 
      playlist.emotion?.toLowerCase() === emotion.toLowerCase()
    ) || null;
  };
  
  const createPlaylist = (data: Omit<MusicPlaylist, 'id'>) => {
    const newPlaylist = {
      ...data,
      id: `playlist-${Date.now()}`,
      tracks: data.tracks?.map(normalizeTrack) || []
    };
    
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };
  
  const updatePlaylist = (id: string, data: Partial<MusicPlaylist>) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === id) {
        return {
          ...playlist,
          ...data,
          tracks: data.tracks 
            ? data.tracks.map(normalizeTrack)
            : playlist.tracks
        };
      }
      return playlist;
    });
    
    setPlaylists(updatedPlaylists);
    return getPlaylistById(id);
  };
  
  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
  };
  
  const addTrackToPlaylist = (playlistId: string, track: MusicTrack) => {
    const playlist = getPlaylistById(playlistId);
    if (!playlist) return null;
    
    // Don't add if track already exists in playlist
    if (playlist.tracks.some(t => t.id === track.id)) {
      return playlist;
    }
    
    const updatedPlaylist = {
      ...playlist,
      tracks: [...playlist.tracks, normalizeTrack(track)]
    };
    
    updatePlaylist(playlistId, updatedPlaylist);
    return updatedPlaylist;
  };
  
  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    const playlist = getPlaylistById(playlistId);
    if (!playlist) return null;
    
    const updatedPlaylist = {
      ...playlist,
      tracks: playlist.tracks.filter(track => track.id !== trackId)
    };
    
    updatePlaylist(playlistId, updatedPlaylist);
    return updatedPlaylist;
  };
  
  return {
    playlists,
    getPlaylistById,
    getPlaylistByEmotion,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist
  };
};

export default usePlaylistManager;
