/**
 * Hook pour charger la vraie bibliothèque musicale depuis Supabase
 * Avec fallback sur les pistes sample
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchUserTracks, 
  fetchUserPlaylists, 
  fetchPublicTracksByMood,
  createPlaylist,
  addTrackToPlaylist,
  recordTrackPlay,
  fetchPlayHistory
} from '@/services/music/realMusicService';
import { sampleTracks, samplePlaylists } from '@/data/sampleTracks';
import { MusicTrack, MusicPlaylist } from '@/types/music';

export function useRealMusicLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Charger les pistes de l'utilisateur
  const tracksQuery = useQuery({
    queryKey: ['music-tracks', user?.id],
    queryFn: () => fetchUserTracks(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Charger les playlists de l'utilisateur
  const playlistsQuery = useQuery({
    queryKey: ['music-playlists', user?.id],
    queryFn: () => fetchUserPlaylists(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Charger l'historique d'écoute
  const historyQuery = useQuery({
    queryKey: ['music-history', user?.id],
    queryFn: () => fetchPlayHistory(user!.id, 30),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation pour créer une playlist
  const createPlaylistMutation = useMutation({
    mutationFn: ({ name, description, mood }: { name: string; description?: string; mood?: string }) =>
      createPlaylist(user!.id, name, description, mood),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-playlists', user?.id] });
    },
  });

  // Mutation pour ajouter une piste à une playlist
  const addToPlaylistMutation = useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: string; trackId: string }) =>
      addTrackToPlaylist(playlistId, trackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-playlists', user?.id] });
    },
  });

  // Enregistrer une lecture
  const recordPlay = async (trackId: string, durationListened: number, mood?: string) => {
    if (!user?.id) return;
    await recordTrackPlay(user.id, trackId, durationListened, mood);
    queryClient.invalidateQueries({ queryKey: ['music-history', user.id] });
  };

  // Combiner les pistes réelles avec les pistes sample comme fallback
  const allTracks: MusicTrack[] = [
    ...(tracksQuery.data || []),
    // Ajouter les samples si l'utilisateur n'a pas de pistes
    ...((!tracksQuery.data || tracksQuery.data.length === 0) ? sampleTracks : []),
  ];

  // Combiner les playlists réelles avec les playlists sample
  const allPlaylists: MusicPlaylist[] = [
    ...(playlistsQuery.data || []),
    // Ajouter les samples si l'utilisateur n'a pas de playlists
    ...((!playlistsQuery.data || playlistsQuery.data.length === 0) ? samplePlaylists : []),
  ];

  return {
    tracks: allTracks,
    playlists: allPlaylists,
    history: historyQuery.data || [],
    loading: tracksQuery.isLoading || playlistsQuery.isLoading,
    error: tracksQuery.error || playlistsQuery.error,
    
    // Actions
    createPlaylist: createPlaylistMutation.mutateAsync,
    addToPlaylist: addToPlaylistMutation.mutateAsync,
    recordPlay,
    
    // Refetch
    refetch: () => {
      tracksQuery.refetch();
      playlistsQuery.refetch();
    },

    // États des mutations
    isCreatingPlaylist: createPlaylistMutation.isPending,
    isAddingToPlaylist: addToPlaylistMutation.isPending,
  };
}

/**
 * Hook pour charger les pistes publiques par mood
 */
export function usePublicTracksByMood(mood: string) {
  return useQuery({
    queryKey: ['public-tracks', mood],
    queryFn: () => fetchPublicTracksByMood(mood),
    staleTime: 10 * 60 * 1000,
    enabled: !!mood,
  });
}
