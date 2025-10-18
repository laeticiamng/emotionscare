// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/lib/logger';

export interface FavoriteRecord {
  trackId: string;
  presetId: string;
  createdAt: string;
  title?: string;
  url?: string;
}

const LOCAL_STORAGE_KEY = "adaptive-music:favorites-sync";

const readLocalFallback = (): FavoriteRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry: any) => entry && typeof entry.trackId === "string");
  } catch (error) {
    logger.warn("[favoritesService] unable to read fallback", error, 'MUSIC');
    return [];
  }
};

const writeLocalFallback = (records: FavoriteRecord[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    logger.warn("[favoritesService] unable to persist fallback", error, 'MUSIC');
  }
};

const getUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      logger.warn("[favoritesService] user lookup error", error, 'MUSIC');
      return null;
    }
    return data.user?.id ?? null;
  } catch (error) {
    logger.warn("[favoritesService] user lookup failure", error, 'MUSIC');
    return null;
  }
};

export const fetchFavoriteRecords = async (): Promise<FavoriteRecord[]> => {
  const fallback = readLocalFallback();
  const userId = await getUserId();
  if (!userId) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("track_id, preset, created_at, metadata")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(24);

    if (error) {
      logger.warn("[favoritesService] query error", error, 'MUSIC');
      return fallback;
    }

    const records: FavoriteRecord[] = (data ?? []).map(entry => ({
      trackId: entry.track_id as string,
      presetId: (entry.preset as string) ?? "ambient_soft",
      createdAt: entry.created_at as string,
      title: typeof entry.metadata?.title === "string" ? entry.metadata.title : undefined,
      url: typeof entry.metadata?.url === "string" ? entry.metadata.url : undefined,
    }));

    writeLocalFallback(records);
    return records;
  } catch (error) {
    logger.warn("[favoritesService] unexpected fetch failure", error, 'MUSIC');
    return fallback;
  }
};

export const toggleFavoriteRecord = async (
  trackId: string,
  presetId: string,
  metadata?: { title?: string; url?: string },
): Promise<FavoriteRecord[]> => {
  const userId = await getUserId();
  const fallback = readLocalFallback();

  if (!userId) {
    const exists = fallback.find(entry => entry.trackId === trackId);
    const next = exists
      ? fallback.filter(entry => entry.trackId !== trackId)
      : [
          ...fallback.filter(entry => entry.trackId !== trackId),
          {
            trackId,
            presetId,
            createdAt: new Date().toISOString(),
            title: metadata?.title,
            url: metadata?.url,
          },
        ];
    writeLocalFallback(next);
    return next;
  }

  const exists = fallback.find(entry => entry.trackId === trackId);
  const nextFallback = exists
    ? fallback.filter(entry => entry.trackId !== trackId)
    : [
        ...fallback.filter(entry => entry.trackId !== trackId),
        {
          trackId,
          presetId,
          createdAt: new Date().toISOString(),
          title: metadata?.title,
          url: metadata?.url,
        },
      ];

  try {
    if (exists) {
      await supabase.from("favorites").delete().eq("user_id", userId).eq("track_id", trackId);
    } else {
      await supabase.from("favorites").upsert({
        user_id: userId,
        track_id: trackId,
        preset: presetId,
        metadata: metadata ?? null,
      });
    }
  } catch (error) {
    logger.warn("[favoritesService] toggle error", error, 'MUSIC');
    return fallback;
  }

  writeLocalFallback(nextFallback);
  return nextFallback;
};
