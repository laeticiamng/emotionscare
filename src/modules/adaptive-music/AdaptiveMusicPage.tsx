"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import {
  PageHeader,
  Card,
  Button,
  AudioPlayer,
} from "@/COMPONENTS.reg";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  requestMoodPlaylist,
  MoodPlaylistResult,
  MoodPlaylistTrack,
} from "@/services/moodPlaylist.service";
import {
  ADAPTIVE_MUSIC_FAVORITES_EVENT,
  ADAPTIVE_MUSIC_PLAYBACK_EVENT,
  AudioPlayerFavoriteEntry,
} from "@/ui/AudioPlayer";
import { useMood } from "@/contexts/MoodContext";
import type { MoodVibe } from "@/utils/moodVibes";
import { recordEvent } from "@/lib/scores/events";
import {
  Clock,
  Heart,
  Music2,
  PlayCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type PlaybackSnapshot = {
  trackId: string;
  position: number;
  updatedAt: number;
  title?: string;
  src?: string;
  wasPlaying?: boolean;
};

const PLAYBACK_STORAGE_PREFIX = "adaptive-music:playback:";
const FAVORITES_STORAGE_KEY = "adaptive-music:favorites";

const formatDuration = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "0:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const translateFocus = (focus: string): string => {
  switch (focus) {
    case "breathing":
      return "Respiration";
    case "flow":
      return "Concentration";
    case "release":
      return "Décharge émotionnelle";
    case "recovery":
      return "Récupération";
    case "uplift":
      return "Élévation";
    case "reset":
      return "Réinitialisation";
    default:
      return focus;
  }
};

const deriveMoodFromProfile = (valence?: number, arousal?: number): string => {
  if (typeof valence !== "number" || typeof arousal !== "number") {
    return "relaxed";
  }

  if (valence > 45 && arousal > 55) {
    return "joyful";
  }

  if (valence > 35) {
    return arousal > 60 ? "joyful" : "relaxed";
  }

  if (valence < -40 && arousal > 55) {
    return "anxious";
  }

  if (valence < -40) {
    return "sleep";
  }

  if (arousal > 75) {
    return "energetic";
  }

  if (arousal > 55) {
    return "focus";
  }

  if (arousal < 35) {
    return "sleep";
  }

  return "relaxed";
};

const deriveIntensity = (arousal?: number): number => {
  if (typeof arousal !== "number") {
    return 0.5;
  }
  return Number(Math.min(1, Math.max(0, arousal / 100)).toFixed(2));
};

const VIBE_TO_MUSIC_MOOD: Record<MoodVibe, string> = {
  calm: "relaxed",
  bright: "joyful",
  focus: "focus",
  reset: "sleep",
};

const MOOD_OPTIONS: Array<{
  value: string;
  label: string;
  helper: string;
  emoji: string;
}> = [
  {
    value: "relaxed",
    label: "Apaisement",
    helper: "Texturé et doux pour relâcher la pression",
    emoji: "😌",
  },
  {
    value: "focus",
    label: "Concentration",
    helper: "Ambiances régulières pour les tâches cognitives",
    emoji: "🎯",
  },
  {
    value: "joyful",
    label: "Élan positif",
    helper: "Textures lumineuses pour amplifier la joie",
    emoji: "✨",
  },
  {
    value: "anxious",
    label: "Décharge du stress",
    helper: "Progression calmante pour apaiser l'anxiété",
    emoji: "🌿",
  },
  {
    value: "sleep",
    label: "Préparer le repos",
    helper: "Berceuses minimalistes pour le soir",
    emoji: "🌙",
  },
  {
    value: "energetic",
    label: "Recharge",
    helper: "Pistes motivantes pour retrouver de l'énergie",
    emoji: "⚡",
  },
];

const useAdaptiveMusicLocalState = () => {
  const readFavorites = React.useCallback((): AudioPlayerFavoriteEntry[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const seen = new Set<string>();
      const entries: AudioPlayerFavoriteEntry[] = [];
      for (const entry of parsed) {
        if (!entry || typeof entry !== "object") continue;
        const id = typeof entry.id === "string" ? entry.id : undefined;
        const src = typeof entry.src === "string" ? entry.src : undefined;
        if (!id || !src || seen.has(id)) continue;
        seen.add(id);
        entries.push({
          id,
          src,
          title: typeof entry.title === "string" ? entry.title : undefined,
          addedAt:
            typeof entry.addedAt === "string"
              ? entry.addedAt
              : new Date().toISOString(),
        });
      }
      return entries;
    } catch (error) {
      console.warn("Unable to read adaptive favorites", error);
      return [];
    }
  }, []);

  const readPlayback = React.useCallback((): PlaybackSnapshot | null => {
    if (typeof window === "undefined") return null;
    let latest: PlaybackSnapshot | null = null;
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith(PLAYBACK_STORAGE_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const updatedAt =
          typeof parsed?.updatedAt === "number" ? parsed.updatedAt : 0;
        if (!latest || updatedAt > latest.updatedAt) {
          const trackId = key.slice(PLAYBACK_STORAGE_PREFIX.length);
          latest = {
            trackId,
            position:
              typeof parsed?.position === "number"
                ? Math.max(0, parsed.position)
                : 0,
            updatedAt,
            title: typeof parsed?.trackTitle === "string" ? parsed.trackTitle : undefined,
            src: typeof parsed?.trackSrc === "string" ? parsed.trackSrc : undefined,
            wasPlaying: typeof parsed?.wasPlaying === "boolean" ? parsed.wasPlaying : false,
          };
        }
      } catch (error) {
        console.warn("Unable to parse playback snapshot", error);
      }
    }
    return latest;
  }, []);

  const [favorites, setFavorites] = React.useState<AudioPlayerFavoriteEntry[]>([]);
  const [playback, setPlayback] = React.useState<PlaybackSnapshot | null>(null);

  const refresh = React.useCallback(() => {
    setFavorites(readFavorites());
    setPlayback(readPlayback());
  }, [readFavorites, readPlayback]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    const handleFavorites = (event: Event) => {
      const detail = (event as CustomEvent<AudioPlayerFavoriteEntry[]>).detail;
      if (Array.isArray(detail)) {
        setFavorites(detail);
        return;
      }
      refresh();
    };

    const handlePlayback = (event: Event) => {
      const detail = (event as CustomEvent<{
        trackId: string;
        title?: string;
        src?: string;
        state: { position?: number; updatedAt?: number; wasPlaying?: boolean };
      }>).detail;
      if (!detail) return;
      setPlayback({
        trackId: detail.trackId,
        position:
          typeof detail.state.position === "number"
            ? Math.max(0, detail.state.position)
            : 0,
        updatedAt:
          typeof detail.state.updatedAt === "number"
            ? detail.state.updatedAt
            : Date.now(),
        title: detail.title,
        src: detail.src,
        wasPlaying: typeof detail.state.wasPlaying === "boolean" ? detail.state.wasPlaying : false,
      });
    };

    window.addEventListener(
      ADAPTIVE_MUSIC_FAVORITES_EVENT,
      handleFavorites as EventListener,
    );
    window.addEventListener(
      ADAPTIVE_MUSIC_PLAYBACK_EVENT,
      handlePlayback as EventListener,
    );

    const handleStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) {
        setFavorites(readFavorites());
      }
      if (event.key && event.key.startsWith(PLAYBACK_STORAGE_PREFIX)) {
        setPlayback(readPlayback());
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener(
        ADAPTIVE_MUSIC_FAVORITES_EVENT,
        handleFavorites as EventListener,
      );
      window.removeEventListener(
        ADAPTIVE_MUSIC_PLAYBACK_EVENT,
        handlePlayback as EventListener,
      );
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [readFavorites, readPlayback, refresh]);

  return { favorites, playback, refresh };
};

const buildPlaylistContext = (mood: string) => {
  switch (mood) {
    case "focus":
      return { activity: "focus" as const };
    case "energetic":
      return { activity: "mood-boost" as const };
    case "sleep":
      return { activity: "sleep" as const, timeOfDay: "evening" as const };
    case "anxious":
      return { activity: "relaxation" as const };
    default:
      return { activity: "relaxation" as const };
  }
};

const AdaptiveMusicPage: React.FC = () => {
  const { currentMood } = useMood();
  const { favorites, playback } = useAdaptiveMusicLocalState();

  const [hasManualSelection, setHasManualSelection] = React.useState(false);
  const [sessionDuration, setSessionDuration] = React.useState(20);
  const [instrumentalOnly, setInstrumentalOnly] = React.useState(true);

  const suggestedMood = React.useMemo(() => {
    const vibe = currentMood.vibe;
    if (vibe && VIBE_TO_MUSIC_MOOD[vibe]) {
      return VIBE_TO_MUSIC_MOOD[vibe];
    }
    return deriveMoodFromProfile(currentMood.valence, currentMood.arousal);
  }, [currentMood.arousal, currentMood.valence, currentMood.vibe]);

  const [selectedMood, setSelectedMood] = React.useState(suggestedMood);

  React.useEffect(() => {
    if (!hasManualSelection) {
      setSelectedMood(suggestedMood);
    }
  }, [hasManualSelection, suggestedMood]);

  const intensity = React.useMemo(
    () => deriveIntensity(currentMood.arousal),
    [currentMood.arousal]
  );

  const query = useQuery<MoodPlaylistResult, Error>({
    queryKey: [
      "adaptive-music",
      selectedMood,
      sessionDuration,
      instrumentalOnly,
      intensity,
    ],
    enabled: Boolean(selectedMood),
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      requestMoodPlaylist({
        mood: selectedMood,
        intensity,
        durationMinutes: sessionDuration,
        preferences: {
          includeInstrumental: true,
          includeVocals: instrumentalOnly ? false : undefined,
        },
        context: buildPlaylistContext(selectedMood),
      }),
    onSuccess: result => {
      const client = Sentry.getCurrentHub().getClient();
      if (!client) {
        return;
      }
      Sentry.addBreadcrumb({
        category: "music",
        level: "info",
        message: "music:playlist_success",
        data: {
          mood: result.mood,
          trackCount: result.tracks.length,
          intensity,
        },
      });
      Sentry.configureScope(scope => {
        scope.setContext("music:last_playlist", {
          mood: result.mood,
          trackCount: result.tracks.length,
          durationMinutes: sessionDuration,
          instrumentalOnly,
        });
      });
    },
    onError: error => {
      const client = Sentry.getCurrentHub().getClient();
      if (!client) {
        return;
      }
      Sentry.addBreadcrumb({
        category: "music",
        level: "error",
        message: "music:playlist_error",
        data: {
          reason: error.name,
        },
      });
    },
  });

  const [activeTrack, setActiveTrack] = React.useState<MoodPlaylistTrack | null>(null);

  React.useEffect(() => {
    const tracks = query.data?.tracks ?? [];
    if (!tracks.length) {
      setActiveTrack(null);
      return;
    }
    setActiveTrack(prev => {
      if (prev) {
        const matching = tracks.find(track => track.id === prev.id);
        if (matching) {
          return matching;
        }
      }
      return tracks[0];
    });
  }, [query.data]);

  const favoriteIds = React.useMemo(() => {
    return new Set(favorites.map(entry => entry.id));
  }, [favorites]);

  const resumeTrackInfo = React.useMemo(() => {
    if (!playback) return null;
    const matching = query.data?.tracks.find(track => track.id === playback.trackId);
    if (matching) {
      return {
        title: matching.title,
        description: matching.description,
        position: playback.position,
      };
    }
    return {
      title: playback.title ?? "Lecture précédente",
      description: "Reprenez où vous vous étiez arrêté(e).",
      position: playback.position,
    };
  }, [playback, query.data]);

  const handleSelectMood = (value: string) => {
    setHasManualSelection(true);
    setSelectedMood(value);
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.addBreadcrumb({
        category: "music",
        level: "info",
        message: "music:mood_change",
        data: { mood: value },
      });
    }
  };

  const handleSelectTrack = (track: MoodPlaylistTrack) => {
    setActiveTrack(track);
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.addBreadcrumb({
        category: "music",
        level: "info",
        message: "music:track_select",
        data: {
          trackId: track.id,
          energy: Number(track.energy.toFixed(2)),
        },
      });
    }
    recordEvent?.({
      module: "adaptive-music",
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationSec: track.duration,
      score: Math.round((query.data?.energyProfile.alignment ?? 0) * 100),
      meta: {
        action: "select-track",
        trackId: track.id,
        mood: query.data?.mood,
        energy: track.energy,
      },
    });
  };

  const queryError = query.error?.message ?? null;

  return (
    <main
      aria-label="Adaptive Music"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8"
    >
      <PageHeader
        title="Adaptive Music"
        subtitle="Une playlist générée pour soutenir votre état émotionnel actuel."
      />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Playlist adaptative</CardTitle>
                <CardDescription>
                  Ajustez les paramètres pour générer une session ciblée et reprendre où
                  vous voulez.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => query.refetch()}
                disabled={query.isFetching}
              >
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                Actualiser
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adaptive-mood">Humeur cible</Label>
                <Select
                  value={selectedMood}
                  onValueChange={handleSelectMood}
                  disabled={query.isFetching}
                >
                  <SelectTrigger id="adaptive-mood">
                    <SelectValue placeholder="Choisir une humeur" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOOD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {option.emoji} {option.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {option.helper}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adaptive-duration">Durée de session</Label>
                <Select
                  value={String(sessionDuration)}
                  onValueChange={value => setSessionDuration(Number(value))}
                  disabled={query.isFetching}
                >
                  <SelectTrigger id="adaptive-duration">
                    <SelectValue placeholder="20 minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 25, 30, 40].map(value => (
                      <SelectItem key={value} value={String(value)}>
                        {value} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-center justify-between rounded-md border px-3 py-2">
                <div className="space-y-1">
                  <Label htmlFor="adaptive-instrumental" className="text-sm font-medium">
                    Instrumental uniquement
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Supprime les pistes avec voix pour favoriser la concentration ou la relaxation profonde.
                  </p>
                </div>
                <Switch
                  id="adaptive-instrumental"
                  checked={instrumentalOnly}
                  onCheckedChange={setInstrumentalOnly}
                  disabled={query.isFetching}
                  aria-label="Activer uniquement les pistes instrumentales"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {query.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                {queryError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {queryError}
                    </AlertDescription>
                  </Alert>
                )}

                {query.data && activeTrack ? (
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4" aria-hidden />
                        {query.data.title}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">{activeTrack.title}</h3>
                      <p className="text-sm text-muted-foreground">{activeTrack.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {formatDuration(activeTrack.duration)}
                        </span>
                        <span>{Math.round(activeTrack.energy * 100)}% énergie</span>
                        <span>Focus&nbsp;: {translateFocus(activeTrack.focus)}</span>
                        <span>Artiste&nbsp;: {activeTrack.artist}</span>
                      </div>
                    </div>

                    <AudioPlayer
                      src={activeTrack.url}
                      trackId={activeTrack.id}
                      title={activeTrack.title}
                      loop={false}
                      defaultVolume={0.75}
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Configurez vos paramètres pour générer une playlist personnalisée.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Favoris & reprise</CardTitle>
              <CardDescription>
                Accédez rapidement à vos pistes sauvegardées et reprenez vos écoutes en cours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border bg-muted/20 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Music2 className="h-4 w-4" aria-hidden />
                  Dernière lecture
                </div>
                {resumeTrackInfo ? (
                  <div className="mt-2 text-sm">
                    <p className="font-semibold">{resumeTrackInfo.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Reprise à {formatDuration(resumeTrackInfo.position)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Lancez une piste pour activer la reprise automatique.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="h-4 w-4" aria-hidden />
                  Favoris récents
                </div>
                {favorites.length ? (
                  <ul className="space-y-2 text-sm">
                    {favorites
                      .slice(-3)
                      .reverse()
                      .map(entry => (
                        <li key={entry.id} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {entry.title ?? "Piste personnalisée"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ajouté le {new Date(entry.addedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Badge variant="secondary">#{entry.id.slice(0, 6)}</Badge>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Utilisez le bouton «&nbsp;Ajouter aux favoris&nbsp;» du lecteur pour retrouver rapidement vos pistes préférées.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guidance de la session</CardTitle>
              <CardDescription>
                Suggestions d'utilisation basées sur l'énergie recommandée.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {query.data ? (
                <>
                  <div className="rounded-md border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      Energie recommandée
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      Alignement {Math.round((query.data.energyProfile.alignment ?? 0) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Énergie cible {Math.round((query.data.energyProfile.recommended ?? 0) * 100)}% — baseline {Math.round((query.data.energyProfile.baseline ?? 0) * 100)}%
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Recommandations</h4>
                    <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                      {query.data.recommendations.map((item, index) => (
                        <li key={`${item}-${index}`}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold">Activités suggérées</h4>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {query.data.guidance.activities.map(activity => (
                        <Badge key={activity} variant="outline">
                          {activity}
                        </Badge>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {query.data.guidance.focus}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Générez une playlist pour afficher les conseils associés.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Composition de la playlist</CardTitle>
            <CardDescription>
              Parcourez les pistes générées et lancez-les instantanément.
            </CardDescription>
          </div>
          {query.data?.metadata.datasetVersion && (
            <Badge variant="secondary">
              Jeu de données {query.data.metadata.datasetVersion}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : query.data && query.data.tracks.length ? (
            <ul className="space-y-4">
              {query.data.tracks.map(track => (
                <li
                  key={track.id}
                  className="flex flex-col gap-3 rounded-md border bg-background p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{track.title}</span>
                      {favoriteIds.has(track.id) && (
                        <Heart className="h-4 w-4 text-rose-500" aria-label="Favori" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {formatDuration(track.duration)}
                      </span>
                      <span>{Math.round(track.energy * 100)}% énergie</span>
                      <span>Focus&nbsp;: {translateFocus(track.focus)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {track.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant={activeTrack?.id === track.id ? "secondary" : "outline"}
                      onClick={() => handleSelectTrack(track)}
                    >
                      {activeTrack?.id === track.id ? (
                        <Music2 className="mr-2 h-4 w-4" aria-hidden />
                      ) : (
                        <PlayCircle className="mr-2 h-4 w-4" aria-hidden />
                      )}
                      {activeTrack?.id === track.id ? "En cours" : "Écouter"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              La playlist apparaîtra ici après génération.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AdaptiveMusicPage;

