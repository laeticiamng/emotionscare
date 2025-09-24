import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/loading/LoadingState';
import { UnifiedEmptyState } from '@/components/ui/unified-empty-state';
import ExportButton from '@/features/scores/ExportButton';
import Mood30dChart from '@/features/scores/Mood30dChart';
import SessionsWeeklyChart from '@/features/scores/SessionsWeeklyChart';
import VibesHeatmap from '@/features/scores/VibesHeatmap';
import { buildMoodVerbalSeries, summarizeMoodVerbalSeries } from '@/features/scores/verbalizers';
import {
  getMoodSeries30d,
  getSessionsWeekly,
  getVibesHeatmap,
  hasAnySessions,
  hasAnyVibes,
  hasMeaningfulMood,
  type MoodPoint,
  type WeeklySessionPoint,
  type VibePoint,
} from '@/services/scores/dataApi';

const STALE_TIME = 60_000;

const emptyStateDescription =
  "Nous n'avons pas encore suffisamment d'historique. Continuez à scanner vos émotions et à enregistrer vos séances pour alimenter cette visualisation.";

const errorMessage = "Impossible de charger toutes les visualisations. Veuillez réessayer plus tard.";

const cardClassName = 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus:outline-none';

const ScoresV2Panel: React.FC = () => {
  const [exportError, setExportError] = useState<string | null>(null);
  const moodChartRef = useRef<HTMLDivElement | null>(null);
  const sessionsChartRef = useRef<HTMLDivElement | null>(null);
  const heatmapRef = useRef<HTMLDivElement | null>(null);

  const moodTitleId = useId();
  const moodDescriptionId = useId();
  const sessionsTitleId = useId();
  const sessionsDescriptionId = useId();
  const heatmapTitleId = useId();
  const heatmapDescriptionId = useId();

  const moodQuery = useQuery<MoodPoint[]>({
    queryKey: ['scores', 'mood-30d'],
    queryFn: getMoodSeries30d,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const sessionsQuery = useQuery<WeeklySessionPoint[]>({
    queryKey: ['scores', 'sessions-weekly'],
    queryFn: () => getSessionsWeekly(8),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const vibesQuery = useQuery<VibePoint[]>({
    queryKey: ['scores', 'vibes-heatmap'],
    queryFn: () => getVibesHeatmap(8),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const hasAnyError = Boolean(moodQuery.error || sessionsQuery.error || vibesQuery.error);

  const moodPoints = moodQuery.data ?? [];
  const sessionRows = sessionsQuery.data ?? [];
  const vibePoints = vibesQuery.data ?? [];

  const moodSeries = useMemo(() => buildMoodVerbalSeries(moodPoints), [moodPoints]);
  const moodSummary = useMemo(() => summarizeMoodVerbalSeries(moodSeries), [moodSeries]);

  useEffect(() => {
    if (!exportError || typeof window === 'undefined') {
      return;
    }
    const timeout = window.setTimeout(() => setExportError(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [exportError]);

  return (
    <section className="space-y-6">
      {hasAnyError && (
        <Alert role="alert" variant="destructive" className="border-destructive">
          <AlertTitle>Chargement partiel</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {exportError && (
        <Alert role="alert" variant="destructive" className="border-destructive/60">
          <AlertTitle>Export PNG</AlertTitle>
          <AlertDescription>{exportError}</AlertDescription>
        </Alert>
      )}

      <Card className={cardClassName} aria-labelledby={moodTitleId} aria-describedby={moodDescriptionId}>
        <CardHeader>
          <CardTitle id={moodTitleId}>Évolution de l'humeur (30 derniers jours)</CardTitle>
          <CardDescription id={moodDescriptionId}>
            Lecture verbalisée des scans émotionnels lissés sur trois jours, combinant valence et activation pour décrire l’ambiance ressentie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {moodQuery.isLoading ? (
            <LoadingState text="Analyse des émotions en cours" />
          ) : hasMeaningfulMood(moodPoints) ? (
            <>
              <Mood30dChart ref={moodChartRef} series={moodSeries} titleId={moodTitleId} descriptionId={moodDescriptionId} />
              <div className="flex flex-wrap items-center justify-between gap-3" aria-live="polite">
                <p className="text-sm text-muted-foreground">{moodSummary}</p>
                <ExportButton
                  targetRef={moodChartRef}
                  fileName="humeur-30-jours"
                  label="Exporter la courbe"
                  onStart={() => setExportError(null)}
                  onError={setExportError}
                />
              </div>
            </>
          ) : (
            <UnifiedEmptyState
              variant="minimal"
              title="Pas encore de scans"
              description={emptyStateDescription}
              className="border border-dashed"
            />
          )}
        </CardContent>
      </Card>

      <Card className={cardClassName} aria-labelledby={sessionsTitleId} aria-describedby={sessionsDescriptionId}>
        <CardHeader>
          <CardTitle id={sessionsTitleId}>Séances par semaine</CardTitle>
          <CardDescription id={sessionsDescriptionId}>
            Panorama hebdomadaire des pratiques guidées, respirations, musiques ou autres activités sur les huit dernières semaines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionsQuery.isLoading ? (
            <LoadingState text="Récupération des séances" />
          ) : hasAnySessions(sessionRows) ? (
            <>
              <SessionsWeeklyChart
                ref={sessionsChartRef}
                rows={sessionRows}
                titleId={sessionsTitleId}
                descriptionId={sessionsDescriptionId}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Chaque colonne représente une semaine ISO (lundi → dimanche). Survolez pour voir le détail des séances.
                </p>
                <ExportButton
                  targetRef={sessionsChartRef}
                  fileName="sessions-hebdomadaires"
                  label="Exporter le graphique"
                  onStart={() => setExportError(null)}
                  onError={setExportError}
                />
              </div>
            </>
          ) : (
            <UnifiedEmptyState
              variant="minimal"
              title="Séances à venir"
              description="Aucune séance consignée récemment. Les visualisations s'activeront dès l'enregistrement de nouvelles pratiques."
              className="border border-dashed"
            />
          )}
        </CardContent>
      </Card>

      <Card className={cardClassName} aria-labelledby={heatmapTitleId} aria-describedby={heatmapDescriptionId}>
        <CardHeader>
          <CardTitle id={heatmapTitleId}>Carte des vibes quotidiennes</CardTitle>
          <CardDescription id={heatmapDescriptionId}>
            Synthèse de la vibe dominante détectée chaque jour (posé, focalisé, lumineux, régénérant). Les teintes plus foncées indiquent une présence renforcée, les jours sans mesure restent en gris doux.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {vibesQuery.isLoading ? (
            <LoadingState text="Construction de la heatmap" />
          ) : hasAnyVibes(vibePoints) ? (
            <>
              <VibesHeatmap ref={heatmapRef} points={vibePoints} titleId={heatmapTitleId} descriptionId={heatmapDescriptionId} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Astuce : placez le focus sur un carré pour connaître la vibe exacte via l'infobulle.
                </p>
                <ExportButton
                  targetRef={heatmapRef}
                  fileName="vibes-heatmap"
                  label="Exporter la heatmap"
                  onStart={() => setExportError(null)}
                  onError={setExportError}
                />
              </div>
            </>
          ) : (
            <UnifiedEmptyState
              variant="minimal"
              title="Vibes en attente"
              description="Dès qu'un scan ou journal renseignera une vibe dominante, la grille se colorera automatiquement."
              className="border border-dashed"
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ScoresV2Panel;
