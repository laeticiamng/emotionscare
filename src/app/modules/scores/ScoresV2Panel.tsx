import React, { useEffect, useId, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Flame, RefreshCcw, Sparkles, TrendingUp, CalendarRange, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/loading/LoadingState";
import { UnifiedEmptyState } from "@/components/ui/unified-empty-state";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  fetchScoresDashboard,
  SCORES_DASHBOARD_FALLBACK,
  type HeatmapPoint,
  type MoodTrendPoint,
  type WeeklySessionsPoint,
} from "@/services/scoresDashboard.service";
import { useChartExporter } from "@/hooks/useChartExporter";

const moodLineColor = "#6366f1";
const energyLineColor = "#f97316";
const gridColor = "rgba(148, 163, 184, 0.25)";
const axisColor = "rgba(100, 116, 139, 0.85)";
const sessionPalette = {
  guided: "#818cf8",
  breathwork: "#34d399",
  vr: "#fbbf24",
  journaling: "#f472b6",
};

const getHeatmapColor = (intensity: number) => {
  if (intensity >= 80) return "rgba(124, 58, 237, 0.95)";
  if (intensity >= 65) return "rgba(139, 92, 246, 0.85)";
  if (intensity >= 50) return "rgba(167, 139, 250, 0.75)";
  if (intensity >= 35) return "rgba(196, 181, 253, 0.6)";
  return "rgba(229, 231, 235, 0.45)";
};

const ensureResizeObserver = () => {
  if (typeof window !== "undefined" && typeof (window as Record<string, unknown>).ResizeObserver === "undefined") {
    (window as Record<string, unknown>).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
  });
};

const MoodTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as MoodTrendPoint | undefined;
  if (!data) return null;

  return (
    <div className="rounded-lg border bg-background p-3 text-sm shadow-md">
      <p className="font-medium">{formatDate(label ?? data.date)}</p>
      <p className="text-primary">Humeur: {data.mood.toFixed(1)}/10</p>
      <p className="text-orange-500">Énergie: {data.energy.toFixed(1)}/10</p>
      <p className="mt-1 text-muted-foreground">{data.annotation}</p>
    </div>
  );
};

const HeatmapTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as HeatmapPoint | undefined;
  if (!data) return null;

  return (
    <div className="rounded-lg border bg-background p-3 text-sm shadow-md">
      <p className="font-medium">{data.day} — {data.slot}</p>
      <p>Sessions: {data.sessions}</p>
      <p className="text-muted-foreground">Vibe dominante: {data.dominantMood}</p>
    </div>
  );
};

const HeatmapCell = ({ cx, cy, fill }: { cx?: number; cy?: number; fill?: string }) => {
  if (typeof cx !== "number" || typeof cy !== "number") {
    return null;
  }

  const size = 40;
  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      rx={12}
      fill={fill}
      className="transition-transform duration-200 ease-out"
    />
  );
};

const HeatmapTable: React.FC<{ data: HeatmapPoint[]; descriptionId?: string }> = ({ data, descriptionId }) => {
  const days = useMemo(() => Array.from(new Set(data.map(point => point.day))), [data]);
  const slots = useMemo(() => Array.from(new Set(data.map(point => point.slot))), [data]);
  const grid = useMemo(() => {
    const lookup = new Map<string, HeatmapPoint>();
    data.forEach(point => {
      lookup.set(`${point.day}-${point.slot}`, point);
    });
    return lookup;
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  return (
    <details
      className="rounded-lg border bg-muted/40 p-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Données tabulaires de la heatmap"
      aria-describedby={descriptionId}
    >
      <summary className="cursor-pointer font-medium focus:outline-none focus-visible:ring-0">
        Vue tabulaire accessible
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full border-collapse text-left" role="table">
          <caption className="sr-only">
            Répartition détaillée des sessions par jour et par créneau avec intensité et humeur dominante.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Jour / Créneau
              </th>
              {slots.map(slot => (
                <th
                  key={slot}
                  scope="col"
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day} className="border-t border-border/40">
                <th scope="row" className="px-3 py-2 text-sm font-medium text-foreground">
                  {day}
                </th>
                {slots.map(slot => {
                  const point = grid.get(`${day}-${slot}`);
                  if (!point) {
                    return (
                      <td key={`${day}-${slot}`} className="px-3 py-2 text-sm text-muted-foreground">
                        0 séance
                      </td>
                    );
                  }

                  return (
                    <td key={`${day}-${slot}`} className="px-3 py-2 align-top text-sm text-foreground">
                      <span className="block font-medium">
                        {point.sessions} {point.sessions > 1 ? 'séances' : 'séance'}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Intensité {point.intensity}/100 — {point.dominantMood}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

const ScoresV2Panel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addError } = useError();

  const moodHeadingId = useId();
  const moodDescriptionId = useId();
  const moodFigureDescriptionId = useId();
  const sessionsHeadingId = useId();
  const sessionsDescriptionId = useId();
  const sessionsFigureDescriptionId = useId();
  const heatmapHeadingId = useId();
  const heatmapDescriptionId = useId();
  const heatmapFigureDescriptionId = useId();
  const heatmapLegendDescriptionId = useId();
  const heatmapTableDescriptionId = useId();

  useEffect(() => {
    ensureResizeObserver();
  }, []);

  const { data, isFetching, error } = useQuery({
    queryKey: ['scores-dashboard', user?.id],
    queryFn: () => fetchScoresDashboard(user!.id),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Impossible de charger le tableau de bord des scores';
      addError({
        message,
        severity: 'high',
        stack: err instanceof Error ? err.stack : undefined,
        context: {
          scope: 'scores-dashboard',
          userId: user?.id ?? 'anonymous',
        },
      });
    },
  });

  const isInitialLoading = isFetching && !data;

  const dataset = data ?? SCORES_DASHBOARD_FALLBACK;
  const summary = dataset.summary;
  const moodTrendData = dataset.moodTrend;
  const weeklySessions = dataset.weeklySessions;
  const heatmapData = dataset.heatmap;

  const level = summary.level;
  const currentExperience = summary.currentExperience;
  const nextLevelExperience = summary.nextLevelExperience;
  const levelProgress = summary.levelProgress;
  const streak = summary.streakDays;
  const lastWeek = summary.lastWeek ?? weeklySessions[weeklySessions.length - 1] ?? {
    week: 'S00',
    guided: 0,
    breathwork: 0,
    vr: 0,
    journaling: 0,
    total: 0,
  };

  const moodAverage = summary.moodAverage;
  const moodVariation = summary.moodVariation;
  const bestMoodDay = summary.bestMoodDay;
  const sessionsAverage = summary.sessionsAverage;
  const mostIntenseSlot = summary.mostIntenseSlot ?? (heatmapData.find(point => point.sessions > 0) ?? {
    day: 'Lun',
    slot: 'Matin',
    intensity: 0,
    dominantMood: 'Repos',
    sessions: 0,
  });

  const remainingExperience = Math.max(0, nextLevelExperience - currentExperience);
  const hasLiveData = dataset.source === 'remote';

  useEffect(() => {
    if (error) {
      toast({
        title: 'Impossible de charger les scores',
        description: error instanceof Error ? error.message : 'Veuillez réessayer ultérieurement.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const { exportToPng, isExporting, error: exportError, resetError } = useChartExporter({
    backgroundColor: '#ffffff',
    padding: 24,
    scale: 2,
  });

  useEffect(() => {
    if (exportError) {
      toast({
        title: 'Export PNG échoué',
        description: exportError,
        variant: 'destructive',
      });
      addError({
        message: exportError,
        severity: 'medium',
        context: {
          scope: 'scores-export',
          userId: user?.id ?? 'anonymous',
        },
      });
      resetError();
    }
  }, [addError, exportError, resetError, toast, user?.id]);

  const moodChartRef = React.useRef<HTMLDivElement>(null);
  const sessionsChartRef = React.useRef<HTMLDivElement>(null);
  const heatmapChartRef = React.useRef<HTMLDivElement>(null);

  if (!user?.id) {
    return (
      <section aria-label="Scores V2" className="py-10">
        <UnifiedEmptyState
          variant="card"
          title="Connectez-vous pour voir vos scores"
          description="Vos indicateurs personnalisés apparaîtront dès que vous enregistrerez vos premières activités."
          animated={false}
        />
      </section>
    );
  }

  if (isInitialLoading) {
    return (
      <section aria-label="Scores V2" className="py-10">
        <LoadingState
          variant="page"
          text="Chargement de vos scores personnalisés..."
          skeletonCount={4}
          className="min-h-[420px]"
        />
      </section>
    );
  }

  const handleRefresh = () => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['scores-dashboard', user.id] });
    }
  };

  const sourceHelper = hasLiveData
    ? 'Synchronisé en temps réel avec vos activités Supabase.'
    : 'Affichage en mode démonstration en attendant vos premières données.';

  const formattedMoodAverage = Number.isFinite(moodAverage) ? moodAverage.toFixed(1) : '0.0';
  const formattedMoodVariation = Number.isFinite(moodVariation) ? moodVariation.toFixed(1) : '0.0';
  const variationNumber = Number.parseFloat(formattedMoodVariation);
  const bestMoodLabel = bestMoodDay ? formatDate(bestMoodDay.date) : '—';
  const averageSessionsLabel = Number.isFinite(sessionsAverage) ? sessionsAverage.toFixed(1) : '0.0';
  const lastWeekLabel = lastWeek.week;
  const lastWeekTotal = lastWeek.total;
  const lastWeekGuided = lastWeek.guided;
  const mostIntenseSessionsLabel = mostIntenseSlot.sessions > 1 ? 'séances' : 'séance';
  const mostIntenseMoodLabel = mostIntenseSlot.dominantMood.toLowerCase();

  const moodSummaryText = useMemo(
    () =>
      `Humeur moyenne ${formattedMoodAverage}/10, variation ${formattedMoodVariation} et pic le ${bestMoodLabel}.`,
    [bestMoodLabel, formattedMoodAverage, formattedMoodVariation]
  );

  const sessionsSummaryText = useMemo(
    () =>
      `Moyenne hebdomadaire de ${averageSessionsLabel} séances, maximum observé semaine ${lastWeekLabel} et ${lastWeekGuided} séances guidées.`,
    [averageSessionsLabel, lastWeekGuided, lastWeekLabel]
  );

  const heatmapSummaryText = useMemo(
    () =>
      `Créneau le plus intense ${mostIntenseSlot.day} ${mostIntenseSlot.slot} avec ${mostIntenseSlot.sessions} ${mostIntenseSessionsLabel} (${mostIntenseSlot.dominantMood.toLowerCase()}).`,
    [mostIntenseSessionsLabel, mostIntenseSlot.day, mostIntenseSlot.dominantMood, mostIntenseSlot.sessions, mostIntenseSlot.slot]
  );

  const heatmapLegendSummary = 'Légende d’intensité de gauche à droite : intense, élevé, modéré, calme et repos.';

  const moodLabelledBy = `${moodHeadingId} ${moodDescriptionId}`.trim();
  const sessionsLabelledBy = `${sessionsHeadingId} ${sessionsDescriptionId}`.trim();
  const heatmapLabelledBy = `${heatmapHeadingId} ${heatmapDescriptionId}`.trim();
  const heatmapFigureDescribedBy = `${heatmapFigureDescriptionId} ${heatmapLegendDescriptionId}`.trim();

  return (
    <section aria-label="Scores V2" className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" id="dashboard-actions">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Scores</h1>
          <p className="text-muted-foreground">Progression, streaks et badges</p>
          <p className="text-xs text-muted-foreground">{sourceHelper}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge variant="secondary" className="px-3 py-1" aria-label={`Niveau ${level}`}>
            Niveau {level}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground" aria-label={`${streak} jours de suite`}>
            <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
            <span>{streak} j de suite</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarRange className="h-4 w-4" aria-hidden="true" />
            <span>{lastWeek.week}: {lastWeek.total} séances</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto md:ml-0"
            data-ui="refresh"
            onClick={handleRefresh}
            disabled={isFetching || !user?.id}
          >
            <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle id={moodHeadingId}>Évolution de l'humeur</CardTitle>
                <CardDescription id={moodDescriptionId}>30 derniers jours, corrélation énergie & activités</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Exporter l'évolution de l'humeur"
                onClick={() => exportToPng(moodChartRef, { fileName: 'scores-humeur' })}
                disabled={isExporting || moodTrendData.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Humeur moyenne</p>
                <p className="text-2xl font-semibold">{formattedMoodAverage}/10</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Variation</p>
                <p
                  className={cn(
                    "text-2xl font-semibold",
                    variationNumber >= 0 ? "text-emerald-600" : "text-red-500",
                  )}
                >
                  {variationNumber >= 0 ? "+" : ""}
                  {formattedMoodVariation}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Pic émotionnel</p>
                <p className="text-2xl font-semibold">{bestMoodLabel}</p>
              </div>
            </div>
            {moodTrendData.length ? (
              <figure
                aria-labelledby={moodLabelledBy}
                aria-describedby={moodFigureDescriptionId}
                role="group"
              >
                <div
                  ref={moodChartRef}
                  className="h-[280px] w-full"
                  data-testid="scores-mood-chart"
                  role="img"
                  aria-labelledby={moodLabelledBy}
                  aria-describedby={moodFigureDescriptionId}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke={axisColor} tickFormatter={formatDate} />
                      <YAxis stroke={axisColor} domain={[0, 10]} tickCount={6} />
                      <Tooltip content={<MoodTooltip />} cursor={{ stroke: "rgba(99, 102, 241, 0.35)" }} />
                      <Legend />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      name="Humeur"
                      stroke={moodLineColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      name="Énergie"
                      stroke={energyLineColor}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                </div>
                <figcaption id={moodFigureDescriptionId} className="sr-only">
                  {moodSummaryText}
                </figcaption>
              </figure>
            ) : (
              <UnifiedEmptyState
                variant="minimal"
                size="sm"
                icon={TrendingUp}
                title="Aucune donnée émotionnelle disponible"
                description="Effectuez vos premières séances pour visualiser votre courbe d'émotions."
                animated={false}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Progression & Badges</CardTitle>
            <CardDescription>Cap sur le niveau suivant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Expérience</span>
                <span>{currentExperience} / {nextLevelExperience}</span>
              </div>
              <Progress value={levelProgress} aria-label="Progression vers le niveau suivant" />
              <p className="text-xs text-muted-foreground">Encore {remainingExperience} pts avant le niveau {level + 1}.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium">Badge Sérénité</p>
                  <p className="text-xs text-muted-foreground">3 séances de respiration consécutives</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <div>
                  <p className="font-medium">Boost hebdo</p>
                  <p className="text-xs text-muted-foreground">{lastWeekTotal} séances réalisées cette semaine</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle id={sessionsHeadingId}>Séances par semaine</CardTitle>
                <CardDescription id={sessionsDescriptionId}>Répartition guidée, respiration, VR et journal</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Exporter les sessions hebdomadaires"
                onClick={() => exportToPng(sessionsChartRef, { fileName: 'scores-sessions' })}
                disabled={isExporting || weeklySessions.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Moyenne</p>
                <p className="text-2xl font-semibold">{averageSessionsLabel} séances</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Semaine max</p>
                <p className="text-2xl font-semibold">{lastWeekLabel}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Guidées</p>
                <p className="text-2xl font-semibold">{lastWeekGuided}</p>
              </div>
            </div>
            {weeklySessions.length ? (
              <figure
                aria-labelledby={sessionsLabelledBy}
                aria-describedby={sessionsFigureDescriptionId}
                role="group"
              >
                <div
                  ref={sessionsChartRef}
                  className="h-[280px] w-full"
                  data-testid="scores-sessions-chart"
                  role="img"
                  aria-labelledby={sessionsLabelledBy}
                  aria-describedby={sessionsFigureDescriptionId}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySessions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                      <XAxis dataKey="week" stroke={axisColor} />
                      <YAxis stroke={axisColor} allowDecimals={false} />
                      <Tooltip
                        cursor={{ fill: "rgba(129, 140, 248, 0.1)" }}
                        contentStyle={{ borderRadius: "0.75rem", borderColor: "rgba(148,163,184,0.4)", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)" }}
                      />
                      <Legend />
                      <Bar dataKey="guided" stackId="sessions" name="Guidées" fill={sessionPalette.guided} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="breathwork" stackId="sessions" name="Respiration" fill={sessionPalette.breathwork} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="vr" stackId="sessions" name="VR" fill={sessionPalette.vr} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="journaling" stackId="sessions" name="Journal" fill={sessionPalette.journaling} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <figcaption id={sessionsFigureDescriptionId} className="sr-only">
                  {sessionsSummaryText}
                </figcaption>
              </figure>
            ) : (
              <UnifiedEmptyState
                variant="minimal"
                size="sm"
                icon={CalendarRange}
                title="Aucune session enregistrée"
                description="Planifiez ou complétez une activité pour alimenter vos statistiques hebdomadaires."
                animated={false}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Focus de la semaine</CardTitle>
            <CardDescription>Moments les plus vibrants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Créneau le plus intense</p>
              <p className="text-lg font-semibold">{mostIntenseSlot.day} — {mostIntenseSlot.slot}</p>
              <p className="text-sm text-muted-foreground">{mostIntenseSlot.sessions} {mostIntenseSessionsLabel}, vibe {mostIntenseMoodLabel}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Pic d'énergie</span>
                <span>{bestMoodLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sessions VR cumulées</span>
                <span>{weeklySessions.reduce((acc, week) => acc + week.vr, 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Respirations guidées</span>
                <span>{weeklySessions.reduce((acc, week) => acc + week.breathwork, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle id={heatmapHeadingId}>Heatmap Vibes</CardTitle>
              <CardDescription id={heatmapDescriptionId}>Intensité émotionnelle par moment clé de la journée</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Exporter la heatmap des vibes"
              onClick={() => exportToPng(heatmapChartRef, { fileName: 'scores-heatmap' })}
              disabled={isExporting || heatmapData.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {heatmapData.length ? (
            <>
              <figure
                aria-labelledby={heatmapLabelledBy}
                aria-describedby={heatmapFigureDescribedBy}
                role="group"
              >
                <div
                  ref={heatmapChartRef}
                  className="h-[320px] w-full"
                  data-testid="scores-heatmap-chart"
                  role="img"
                  aria-labelledby={heatmapLabelledBy}
                  aria-describedby={heatmapFigureDescribedBy}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                      <XAxis type="category" dataKey="slot" stroke={axisColor} allowDuplicatedCategory={false} />
                      <YAxis type="category" dataKey="day" stroke={axisColor} width={60} />
                      <Tooltip content={<HeatmapTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.4)", strokeWidth: 1 }} />
                      <Scatter data={heatmapData} shape={(props) => <HeatmapCell {...props} />}>
                        {heatmapData.map((entry) => (
                          <Cell key={`${entry.day}-${entry.slot}`} fill={getHeatmapColor(entry.intensity)} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <figcaption id={heatmapFigureDescriptionId} className="sr-only">
                  {heatmapSummaryText}
                </figcaption>
              </figure>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground" id={heatmapLegendDescriptionId}>
                <span className="sr-only">{heatmapLegendSummary}</span>
                {[
                  { label: "Intense", value: 85 },
                  { label: "Élevé", value: 65 },
                  { label: "Modéré", value: 50 },
                  { label: "Calme", value: 30 },
                  { label: "Repos", value: 10 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="h-3 w-6 rounded-full" style={{ backgroundColor: getHeatmapColor(value) }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <p id={heatmapTableDescriptionId} className="sr-only">
                Vue tabulaire décrivant les intensités et nombres de séances pour chaque moment de la semaine.
              </p>
              <HeatmapTable data={heatmapData} descriptionId={heatmapTableDescriptionId} />
            </>
          ) : (
            <UnifiedEmptyState
              variant="minimal"
              size="sm"
              icon={Sparkles}
              title="Pas encore de heatmap"
              description="La carte de chaleur se remplira dès que plusieurs activités auront été enregistrées."
              animated={false}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default ScoresV2Panel;
