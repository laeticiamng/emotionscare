import React from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/ui/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Music2, Sparkles } from "lucide-react";

import { useFlags } from "@/core/flags";
import { useAssessment } from "@/hooks/useAssessment";
import useCurrentMood from "@/hooks/useCurrentMood";
import useMusicFavorites from "@/hooks/useMusicFavorites";
import { useAdaptivePlayback } from "@/hooks/music/useAdaptivePlayback";
import {
  requestMoodPlaylist,
  type MoodPlaylistResult,
  type MoodPlaylistTrack,
  type MoodPlaylistEnergyFocus,
} from "@/services/moodPlaylist.service";
import {
  mapStateToPreset,
  type PomsTrendSummary,
  type AdaptivePresetId,
} from "@/services/music/presetMapper";
import {
  INTENSITY_TEXT,
  INTENSITY_TO_VALUE,
  PRESET_DETAILS,
  PRESET_TO_MOOD,
  describePresetChange,
} from "@/services/music/presetMetadata";
import { AudioPlayer, type PlaybackSnapshot } from "@/ui/AudioPlayer";

const FOCUS_LABELS: Record<MoodPlaylistEnergyFocus, string> = {
  breathing: "Respiration guidée",
  flow: "Flux créatif",
  release: "Décharge douce",
  recovery: "Récupération soyeuse",
  uplift: "Élévation délicate",
  reset: "Ré-ancrage serein",
};

type PomsTensionLevel = "relachee" | "ouverte" | "vigilante";
type PomsFatigueLevel = "ressourcee" | "stable" | "alourdie";

type PomsFormValues = {
  tension: PomsTensionLevel;
  fatigue: PomsFatigueLevel;
};

const TENSION_OPTIONS: Array<{ value: PomsTensionLevel; label: string; helper: string; score: number }> = [
  { value: "relachee", label: "Épaules très souples", helper: "La respiration est ample", score: 1 },
  { value: "ouverte", label: "Tonus tranquille", helper: "Présence stable et sereine", score: 2 },
  { value: "vigilante", label: "Encore un peu de tension", helper: "Envie de relâcher davantage", score: 3 },
];

const FATIGUE_OPTIONS: Array<{ value: PomsFatigueLevel; label: string; helper: string; score: number }> = [
  { value: "ressourcee", label: "Énergie douce", helper: "L'élan intérieur est disponible", score: 1 },
  { value: "stable", label: "Présence constante", helper: "Le corps reste confortable", score: 2 },
  { value: "alourdie", label: "Besoin de repos", helper: "Une pause bienvenue serait aidante", score: 3 },
];

const scoreTension = (value: PomsTensionLevel) =>
  TENSION_OPTIONS.find(option => option.value === value)?.score ?? 2;
const scoreFatigue = (value: PomsFatigueLevel) =>
  FATIGUE_OPTIONS.find(option => option.value === value)?.score ?? 2;

const buildSummary = (pre: PomsFormValues, post: PomsFormValues): PomsTrendSummary => {
  const tensionDelta = scoreTension(post.tension) - scoreTension(pre.tension);
  const fatigueDelta = scoreFatigue(post.fatigue) - scoreFatigue(pre.fatigue);

  const summary: PomsTrendSummary = {
    tensionTrend: tensionDelta < 0 ? "down" : tensionDelta > 0 ? "up" : "steady",
    fatigueTrend: fatigueDelta > 0 ? "up" : fatigueDelta < 0 ? "down" : "steady",
    note: null,
    completed: true,
  };

  const notes: string[] = [];
  if (summary.tensionTrend === "down") {
    notes.push("Belle détente repérée, on prolonge cette douceur.");
  } else if (summary.tensionTrend === "up") {
    notes.push("On garde une présence très enveloppante pour relâcher.");
  }

  if (summary.fatigueTrend === "up") {
    notes.push("On adoucit le tempo pour soutenir la récupération.");
  } else if (summary.fatigueTrend === "down") {
    notes.push("Un regain d'élan se dessine, on peut colorer légèrement la texture.");
  }

  summary.note = notes.length ? notes.join(" ") : null;
  return summary;
};

const describeTrend = (summary: PomsTrendSummary | null): string => {
  if (!summary) {
    return "Partage ton ressenti quand tu le souhaites pour affiner encore la texture.";
  }

  if (summary.tensionTrend === "down" && summary.fatigueTrend !== "up") {
    return "La tension décroît nettement, savourons cette bulle qui se prolonge.";
  }

  if (summary.fatigueTrend === "up") {
    return "Une légère fatigue s'installe, nous allons choyer la suite.";
  }

  if (summary.tensionTrend === "up") {
    return "Un peu de tension subsiste, la musique reste toute en délicatesse.";
  }

  return "Le ressenti reste stable, la sélection conserve cette caresse sonore.";
};

const TrackCard: React.FC<{
  track: MoodPlaylistTrack;
  active: boolean;
  onSelect: () => void;
}> = ({ track, active, onSelect }) => {
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-muted/60 bg-background/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{track.title}</p>
          <p className="text-xs text-muted-foreground">{track.artist}</p>
        </div>
        {active && <Badge variant="secondary">En écoute</Badge>}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-1">{FOCUS_LABELS[track.focus]}</span>
        {track.instrumentation.slice(0, 2).map(item => (
          <span key={item} className="rounded-full border px-2 py-1">
            {item}
          </span>
        ))}
        {track.tags.slice(0, 1).map(tag => (
          <span key={tag} className="rounded-full border px-2 py-1">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={active ? "secondary" : "outline"}
          onClick={onSelect}
        >
          {active ? "En cours" : "Goûter"}
        </Button>
      </div>
    </li>
  );
};

const AdaptiveMusicPage: React.FC = () => {
  const { has } = useFlags();
  const mood = useCurrentMood();
  const playback = useAdaptivePlayback();
  const favorites = useMusicFavorites();
  const pomsAssessment = useAssessment("POMS");

  const [pomsOptIn, setPomsOptIn] = React.useState<boolean | null>(has("FF_ASSESS_POMS") ? null : false);
  const [prePoms, setPrePoms] = React.useState<PomsFormValues | null>(null);
  const [postPoms, setPostPoms] = React.useState<PomsFormValues | null>(null);
  const [pomsSummary, setPomsSummary] = React.useState<PomsTrendSummary | null>(null);
  const [ctaAcknowledged, setCtaAcknowledged] = React.useState(false);
  const [resumePromptDismissed, setResumePromptDismissed] = React.useState(false);
  const [presetLiveMessage, setPresetLiveMessage] = React.useState(
    "Sélection musicale ajustée pour rester confortable.",
  );

  const recommendation = React.useMemo(
    () =>
      mapStateToPreset(
        {
          valence: mood.valence ?? 0,
          arousal: mood.normalized.arousal,
        },
        pomsSummary,
      ),
    [mood.valence, mood.normalized.arousal, pomsSummary],
  );

  React.useEffect(() => {
    setPresetLiveMessage(describePresetChange(recommendation.presetId, recommendation.intensity));
  }, [recommendation.intensity, recommendation.presetId]);

  const intensityValue = INTENSITY_TO_VALUE[recommendation.intensity] ?? 0.4;
  const playlistMood = PRESET_TO_MOOD[recommendation.presetId];
  const sessionDuration = pomsSummary?.fatigueTrend === "up" ? 15 : 20;

  const playlistQuery = useQuery<MoodPlaylistResult, Error>({
    queryKey: [
      "adaptive-music",
      playlistMood,
      intensityValue,
      sessionDuration,
      recommendation.presetId,
      pomsSummary?.tensionTrend ?? "none",
      pomsSummary?.fatigueTrend ?? "none",
    ],
    enabled: has("FF_MUSIC") && Boolean(playlistMood),
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      requestMoodPlaylist({
        mood: playlistMood,
        intensity: intensityValue,
        durationMinutes: sessionDuration,
        preferences: { includeInstrumental: true },
        context:
          recommendation.presetId === "focus_light"
            ? { activity: "focus" }
            : recommendation.presetId === "bright_mist"
              ? { activity: "mood-boost" }
              : { activity: "relaxation", timeOfDay: "evening" },
      }),
  });

  const playlist = playlistQuery.data;
  const [selectedTrackId, setSelectedTrackId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!playback.snapshot) {
      setResumePromptDismissed(false);
    }
  }, [playback.snapshot?.trackId]);

  React.useEffect(() => {
    if (!playlist) return;
    if (selectedTrackId) return;

    const resumeTrackId = playback.snapshot?.trackId;
    const resumeTrack = resumeTrackId
      ? playlist.tracks.find(track => track.id === resumeTrackId)
      : null;

    if (resumeTrack) {
      setSelectedTrackId(resumeTrack.id);
    } else if (playlist.tracks.length > 0) {
      setSelectedTrackId(playlist.tracks[0].id);
    }
  }, [playlist, playback.snapshot, selectedTrackId]);

  const selectedTrack = React.useMemo<MoodPlaylistTrack | null>(() => {
    if (!playlist || !selectedTrackId) return null;
    return playlist.tracks.find(track => track.id === selectedTrackId) ?? null;
  }, [playlist, selectedTrackId]);

  const resumeControls = React.useMemo(() => {
    if (!selectedTrack || !playback.snapshot) return undefined;
    if (playback.snapshot.trackId !== selectedTrack.id) return undefined;
    return {
      position: playback.snapshot.position,
      allow: true,
      label: "Reprendre ton écoute",
      onResume: async () => {
        playback.update({
          trackId: selectedTrack.id,
          position: playback.snapshot?.position ?? 0,
          presetId: recommendation.presetId,
          title: selectedTrack.title,
          url: selectedTrack.url,
        });
      },
    };
  }, [playback, recommendation.presetId, selectedTrack]);

  const handleProgress = React.useCallback(
    (snapshot: PlaybackSnapshot) => {
      playback.update({
        trackId: snapshot.trackId,
        position: snapshot.position,
        volume: snapshot.volume,
        wasPlaying: snapshot.wasPlaying,
        presetId: recommendation.presetId,
        title: snapshot.title ?? selectedTrack?.title,
        url: snapshot.src ?? selectedTrack?.url,
      });
    },
    [playback, recommendation.presetId, selectedTrack],
  );

  const favoriteControls = React.useMemo(() => {
    if (!selectedTrack) return undefined;
    return {
      active: favorites.isFavorite(selectedTrack.id),
      onToggle: () =>
        favorites.toggleFavorite(selectedTrack.id, recommendation.presetId, {
          title: selectedTrack.title,
          url: selectedTrack.url,
        }),
      busy: favorites.isToggling,
      addLabel: "Garder cette bulle",
      removeLabel: "Retirer de mes bulles",
    };
  }, [favorites, recommendation.presetId, selectedTrack]);

  React.useEffect(() => {
    if (!pomsOptIn) return;
    pomsAssessment.start().catch(() => {
      /* ignore network errors */
    });
  }, [pomsOptIn, pomsAssessment]);

  const handlePreSubmit = React.useCallback(
    async (values: PomsFormValues) => {
      setPrePoms(values);
      setPostPoms(null);
      setPomsSummary(null);
      setCtaAcknowledged(false);
      try {
        await pomsAssessment.submit({ moment: "pre", tension: values.tension, fatigue: values.fatigue });
      } catch (error) {
        console.warn("[adaptive-music] unable to store pre POMS", error);
      }
    },
    [pomsAssessment],
  );

  const handlePostSubmit = React.useCallback(
    async (values: PomsFormValues) => {
      if (!prePoms) return;
      setPostPoms(values);
      const summary = buildSummary(prePoms, values);
      setPomsSummary(summary);
      setCtaAcknowledged(false);
      try {
        await pomsAssessment.submit({ moment: "post", tension: values.tension, fatigue: values.fatigue });
      } catch (error) {
        console.warn("[adaptive-music] unable to store post POMS", error);
      }
    },
    [pomsAssessment, prePoms],
  );

  const presetDetail = PRESET_DETAILS[recommendation.presetId];
  const intensityNarrative = INTENSITY_TEXT[recommendation.intensity];

  if (!has("FF_MUSIC")) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6" data-testid="adaptive-music-page">
        <PageHeader
          title="Adaptive Music"
          subtitle="La musicothérapie adaptative est momentanément endormie."
        />
        <Alert>
          <AlertDescription>
            L'accès musical est désactivé pour le moment. Revenez bientôt pour retrouver vos ambiances.
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  const favoriteEntries = favorites.favorites.slice(0, 3);
  const resumeTrack = playback.snapshot && playlist?.tracks.find(track => track.id === playback.snapshot?.trackId);

  return (
    <main
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8"
      aria-label="Adaptive Music"
      data-testid="adaptive-music-page"
    >
      <div aria-live="polite" className="sr-only">
        {presetLiveMessage}
      </div>
      <PageHeader
        title="Adaptive Music"
        subtitle="Une bulle sonore qui se cale sur ton souffle et tes ressentis du moment."
      />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Horizon sonore du moment</CardTitle>
            <CardDescription>
              {mood.headline}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-muted/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{mood.description}</p>
                  <p className="text-lg font-semibold">
                    {mood.emoji} {presetDetail.label}
                  </p>
                </div>
                <Badge variant="secondary">{mood.label}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{presetDetail.tone}</p>
              <p className="text-xs text-muted-foreground">{presetDetail.accent}</p>
              {intensityNarrative && (
                <p className="text-xs text-muted-foreground">{intensityNarrative}</p>
              )}
            </div>

            <div className="rounded-lg border border-muted/60 bg-muted/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" aria-hidden />
                {describeTrend(pomsSummary)}
              </div>
              {pomsSummary?.note && (
                <p className="mt-2 text-xs text-muted-foreground">{pomsSummary.note}</p>
              )}
            </div>

            {playlistQuery.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  La playlist tarde à répondre. On réessaie dès que possible.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favoris & reprise</CardTitle>
            <CardDescription>
              Retrouve ton cocon et tes bulles gardées précieusement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Music2 className="h-4 w-4" aria-hidden />
                Ton dernier cocon
              </div>
              {resumeTrack ? (
                <div className="mt-2 text-sm">
                  <p className="font-medium">{resumeTrack.title}</p>
                  <p className="text-xs text-muted-foreground">{resumeTrack.artist}</p>
                  <div className="mt-3 flex gap-2">
                    {!resumePromptDismissed && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setSelectedTrackId(resumeTrack.id);
                            setResumePromptDismissed(true);
                          }}
                        >
                          Reprendre ma bulle
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setResumePromptDismissed(true);
                            playback.clear();
                          }}
                        >
                          Nouvelle ambiance
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Lance une piste et nous garderons la reprise pour toi.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Heart className="h-4 w-4" aria-hidden />
                Tes bulles gardées
              </div>
              {favoriteEntries.length ? (
                <ul className="mt-2 space-y-2 text-sm">
                  {favoriteEntries.map(entry => (
                    <li
                      key={entry.trackId}
                      className="rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground"
                    >
                      <span className="block font-medium text-foreground">
                        {entry.title ?? "Ambiance personnalisée"}
                      </span>
                      <span className="text-muted-foreground">
                        Conservée comme repère doux
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Ajoute une bulle pour la retrouver ici à chaque visite.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Plaisir d'écoute</CardTitle>
            <CardDescription>
              Lance la piste qui résonne avec ton état du moment.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => playlistQuery.refetch()}>
              Régénérer la sélection
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedTrack ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-muted/60 bg-muted/10 p-4">
                <p className="text-sm font-semibold">{selectedTrack.title}</p>
                <p className="text-xs text-muted-foreground">{selectedTrack.artist}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {selectedTrack.description || "Ambiance taillée pour accompagner doucement la respiration."}
                </p>
              </div>

              {recommendation.cta === "encore_2_min" && !ctaAcknowledged && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
                  <span className="text-sm font-medium text-primary">Tension en baisse 🎉</span>
                  <Button type="button" size="sm" onClick={() => setCtaAcknowledged(true)}>
                    Encore 2 min
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Prolonge ce relâchement, la transition reste longue et tendre.
                  </p>
                </div>
              )}

              <AudioPlayer
                src={selectedTrack.url}
                title={selectedTrack.title}
                trackId={selectedTrack.id}
                presetId={recommendation.presetId}
                crossfadeMs={recommendation.crossfadeMs}
                favorite={favoriteControls}
                resume={resumeControls}
                onProgress={handleProgress}
              />
            </div>
          ) : playlistQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Nous préparons une ambiance sur mesure…</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Générez une playlist pour découvrir les pistes adaptées à votre état.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affiner avec POMS (optionnel)</CardTitle>
          <CardDescription>
            Un micro check-in avant et après permet d'ajuster encore plus finement la texture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pomsOptIn === null ? (
            <div className="flex flex-col gap-3 rounded-lg border border-muted/60 bg-muted/10 p-4">
              <p className="text-sm font-medium">Envie de partager ton ressenti en quelques souffles ?</p>
              <p className="text-xs text-muted-foreground">
                Deux mini questions avant/après pour que la musique colle à ton état.
              </p>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={() => setPomsOptIn(true)}>
                  Oui, allons-y
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setPomsOptIn(false)}>
                  Pas maintenant
                </Button>
              </div>
            </div>
          ) : pomsOptIn === false ? (
            <div className="flex flex-col gap-3 rounded-lg border border-muted/60 bg-muted/10 p-4">
              <p className="text-sm font-medium">Tu pourras activer le mini point d'entrée quand tu le souhaites.</p>
              <p className="text-xs text-muted-foreground">
                Aucun suivi n'est lancé pour le moment, la musique s'appuie juste sur ton état du jour.
              </p>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={() => setPomsOptIn(true)}>
                  Activer maintenant
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-muted/60 bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Avant l'écoute</p>
                  <Switch
                    checked={Boolean(prePoms)}
                    onCheckedChange={checked => {
                      if (!checked) {
                        setPrePoms(null);
                        setPostPoms(null);
                        setPomsSummary(null);
                        setCtaAcknowledged(false);
                        return;
                      }
                    }}
                  />
                </div>
                {!prePoms && (
                  <form
                    className="mt-4 space-y-3 text-sm"
                    onSubmit={event => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      const tension = (data.get("pre-tension") as PomsTensionLevel) ?? "relachee";
                      const fatigue = (data.get("pre-fatigue") as PomsFatigueLevel) ?? "stable";
                      handlePreSubmit({ tension, fatigue });
                    }}
                  >
                    <fieldset className="space-y-2">
                      <legend className="text-xs uppercase tracking-wide text-muted-foreground">
                        Tension
                      </legend>
                      {TENSION_OPTIONS.map(option => (
                        <Label key={option.value} className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="pre-tension"
                            value={option.value}
                            defaultChecked={option.value === "relachee"}
                            className="h-3 w-3"
                          />
                          <span>
                            {option.label}
                            <span className="block text-[11px] text-muted-foreground">
                              {option.helper}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </fieldset>
                    <fieldset className="space-y-2">
                      <legend className="text-xs uppercase tracking-wide text-muted-foreground">
                        Fatigue
                      </legend>
                      {FATIGUE_OPTIONS.map(option => (
                        <Label key={option.value} className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="pre-fatigue"
                            value={option.value}
                            defaultChecked={option.value === "stable"}
                            className="h-3 w-3"
                          />
                          <span>
                            {option.label}
                            <span className="block text-[11px] text-muted-foreground">
                              {option.helper}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </fieldset>
                    <Button type="submit" size="sm">
                      Enregistrer ce ressenti
                    </Button>
                  </form>
                )}
                {prePoms && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Ton ressenti de départ est bien pris en compte.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-muted/60 bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Après l'écoute</p>
                  <Switch
                    checked={Boolean(postPoms)}
                    disabled={!prePoms}
                    onCheckedChange={checked => {
                      if (!checked) {
                        setPostPoms(null);
                        setPomsSummary(null);
                        setCtaAcknowledged(false);
                        return;
                      }
                    }}
                  />
                </div>
                {!postPoms && prePoms && (
                  <form
                    className="mt-4 space-y-3 text-sm"
                    onSubmit={event => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      const tension = (data.get("post-tension") as PomsTensionLevel) ?? "relachee";
                      const fatigue = (data.get("post-fatigue") as PomsFatigueLevel) ?? "stable";
                      handlePostSubmit({ tension, fatigue });
                    }}
                  >
                    <fieldset className="space-y-2">
                      <legend className="text-xs uppercase tracking-wide text-muted-foreground">
                        Tension actuelle
                      </legend>
                      {TENSION_OPTIONS.map(option => (
                        <Label key={option.value} className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="post-tension"
                            value={option.value}
                            defaultChecked={option.value === "relachee"}
                            className="h-3 w-3"
                          />
                          <span>
                            {option.label}
                            <span className="block text-[11px] text-muted-foreground">
                              {option.helper}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </fieldset>
                    <fieldset className="space-y-2">
                      <legend className="text-xs uppercase tracking-wide text-muted-foreground">
                        Niveau d'énergie
                      </legend>
                      {FATIGUE_OPTIONS.map(option => (
                        <Label key={option.value} className="flex items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="post-fatigue"
                            value={option.value}
                            defaultChecked={option.value === "stable"}
                            className="h-3 w-3"
                          />
                          <span>
                            {option.label}
                            <span className="block text-[11px] text-muted-foreground">
                              {option.helper}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </fieldset>
                    <Button type="submit" size="sm">
                      Partager ce ressenti
                    </Button>
                  </form>
                )}
                {!prePoms && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Active d'abord le mini point d'entrée pour comparer les ressentis.
                  </p>
                )}
                {postPoms && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Merci pour ce partage, la sélection s'ajuste instantanément.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Les textures proposées</CardTitle>
          <CardDescription>
            Choisis librement la piste qui résonne avec toi, elles restent toutes douces et accueillantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {playlistQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Préparation de la bulle sonore…</p>
          ) : playlist && playlist.tracks.length > 0 ? (
            <ul className="space-y-3">
              {playlist.tracks.map(track => (
                <TrackCard
                  key={track.id}
                  track={track}
                  active={track.id === selectedTrack?.id}
                  onSelect={() => {
                    setSelectedTrackId(track.id);
                    playback.update({
                      trackId: track.id,
                      position: 0,
                      presetId: recommendation.presetId,
                      title: track.title,
                      url: track.url,
                    });
                  }}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Lance une génération pour afficher les propositions musicales.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default AdaptiveMusicPage;
