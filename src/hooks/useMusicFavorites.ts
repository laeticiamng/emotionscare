import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchFavoriteRecords,
  toggleFavoriteRecord,
  type FavoriteRecord,
} from "@/services/music/favoritesService";

const QUERY_KEY = ["adaptive-music", "favorites"] as const;

export const useMusicFavorites = () => {
  const queryClient = useQueryClient();

  const query = useQuery<FavoriteRecord[]>({
    queryKey: QUERY_KEY,
    queryFn: fetchFavoriteRecords,
    staleTime: 60_000,
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: ({
      trackId,
      presetId,
      metadata,
    }: {
      trackId: string;
      presetId: string;
      metadata?: { title?: string; url?: string };
    }) => toggleFavoriteRecord(trackId, presetId, metadata),
    onSuccess: data => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  const isFavorite = useCallback(
    (trackId: string | null | undefined) => {
      if (!trackId) return false;
      return (query.data ?? []).some(entry => entry.trackId === trackId);
    },
    [query.data],
  );

  const toggle = useCallback(
    async (trackId: string, presetId: string, metadata?: { title?: string; url?: string }) => {
      await mutation.mutateAsync({ trackId, presetId, metadata });
    },
    [mutation],
  );

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
    isFavorite,
    toggleFavorite: toggle,
    isToggling: mutation.isPending,
  };
};

export default useMusicFavorites;
