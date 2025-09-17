import React, { useMemo } from "react";
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
import { Flame, RefreshCcw, Sparkles, TrendingUp, CalendarRange } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MoodTrendPoint {
  date: string;
  mood: number;
  energy: number;
  annotation: string;
}

interface WeeklySessionsPoint {
  week: string;
  guided: number;
  breathwork: number;
  vr: number;
  journaling: number;
}

interface HeatmapPoint {
  day: string;
  slot: string;
  intensity: number;
  dominantMood: string;
  sessions: number;
}

const MOOD_TREND_DATA: MoodTrendPoint[] = [
  { date: "2024-03-17", mood: 6.2, energy: 6.0, annotation: "Respiration 4-7-8" },
  { date: "2024-03-18", mood: 6.8, energy: 6.3, annotation: "Séance VR focus" },
  { date: "2024-03-19", mood: 7.1, energy: 6.9, annotation: "Coaching empathique" },
  { date: "2024-03-20", mood: 7.4, energy: 7.3, annotation: "Routine complète" },
  { date: "2024-03-21", mood: 7.2, energy: 7.0, annotation: "Journal guidé" },
  { date: "2024-03-22", mood: 7.9, energy: 7.6, annotation: "Session immersive" },
  { date: "2024-03-23", mood: 8.2, energy: 7.8, annotation: "Mix musique + respiration" },
  { date: "2024-03-24", mood: 8.4, energy: 8.2, annotation: "Weekend ressourçant" },
  { date: "2024-03-25", mood: 8.1, energy: 8.0, annotation: "Check-in matinal" },
  { date: "2024-03-26", mood: 8.6, energy: 8.4, annotation: "Routine + appel coach" },
];

const WEEKLY_SESSIONS_DATA: WeeklySessionsPoint[] = [
  { week: "S08", guided: 2, breathwork: 1, vr: 0, journaling: 1 },
  { week: "S09", guided: 3, breathwork: 2, vr: 1, journaling: 1 },
  { week: "S10", guided: 3, breathwork: 2, vr: 2, journaling: 1 },
  { week: "S11", guided: 4, breathwork: 2, vr: 2, journaling: 2 },
  { week: "S12", guided: 4, breathwork: 3, vr: 2, journaling: 2 },
  { week: "S13", guided: 5, breathwork: 3, vr: 3, journaling: 2 },
];

const HEATMAP_DATA: HeatmapPoint[] = [
  { day: "Lun", slot: "Matin", intensity: 75, dominantMood: "Apaisé", sessions: 2 },
  { day: "Lun", slot: "Midi", intensity: 48, dominantMood: "Concentré", sessions: 1 },
  { day: "Lun", slot: "Après-midi", intensity: 62, dominantMood: "Créatif", sessions: 1 },
  { day: "Lun", slot: "Soir", intensity: 40, dominantMood: "Repos", sessions: 1 },
  { day: "Mar", slot: "Matin", intensity: 80, dominantMood: "Positif", sessions: 2 },
  { day: "Mar", slot: "Midi", intensity: 55, dominantMood: "Motivé", sessions: 1 },
  { day: "Mar", slot: "Après-midi", intensity: 68, dominantMood: "Focus", sessions: 2 },
  { day: "Mar", slot: "Soir", intensity: 35, dominantMood: "Calme", sessions: 1 },
  { day: "Mer", slot: "Matin", intensity: 72, dominantMood: "Positif", sessions: 2 },
  { day: "Mer", slot: "Midi", intensity: 58, dominantMood: "Engagé", sessions: 1 },
  { day: "Mer", slot: "Après-midi", intensity: 66, dominantMood: "Concentré", sessions: 1 },
  { day: "Mer", slot: "Soir", intensity: 44, dominantMood: "Déconnexion", sessions: 1 },
  { day: "Jeu", slot: "Matin", intensity: 84, dominantMood: "Euphorique", sessions: 3 },
  { day: "Jeu", slot: "Midi", intensity: 62, dominantMood: "Créatif", sessions: 1 },
  { day: "Jeu", slot: "Après-midi", intensity: 70, dominantMood: "Confiant", sessions: 2 },
  { day: "Jeu", slot: "Soir", intensity: 50, dominantMood: "Serein", sessions: 1 },
  { day: "Ven", slot: "Matin", intensity: 77, dominantMood: "Motivé", sessions: 2 },
  { day: "Ven", slot: "Midi", intensity: 60, dominantMood: "Concentré", sessions: 1 },
  { day: "Ven", slot: "Après-midi", intensity: 73, dominantMood: "Inspiré", sessions: 2 },
  { day: "Ven", slot: "Soir", intensity: 52, dominantMood: "Calme", sessions: 1 },
  { day: "Sam", slot: "Matin", intensity: 68, dominantMood: "Détendu", sessions: 1 },
  { day: "Sam", slot: "Midi", intensity: 54, dominantMood: "Curieux", sessions: 1 },
  { day: "Sam", slot: "Après-midi", intensity: 76, dominantMood: "Enthousiaste", sessions: 2 },
  { day: "Sam", slot: "Soir", intensity: 64, dominantMood: "Serein", sessions: 2 },
  { day: "Dim", slot: "Matin", intensity: 70, dominantMood: "Positif", sessions: 1 },
  { day: "Dim", slot: "Midi", intensity: 46, dominantMood: "Paisible", sessions: 1 },
  { day: "Dim", slot: "Après-midi", intensity: 58, dominantMood: "Réflexif", sessions: 1 },
  { day: "Dim", slot: "Soir", intensity: 49, dominantMood: "Repos", sessions: 1 },
];

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

const ScoresV2Panel: React.FC = () => {
  ensureResizeObserver();
  const level = 3;
  const currentExperience = 1860;
  const nextLevelExperience = 2200;
  const streak = 7;

  const levelProgress = Math.min(100, Math.round((currentExperience / nextLevelExperience) * 100));

  const moodAverage = useMemo(() => {
    const total = MOOD_TREND_DATA.reduce((acc, point) => acc + point.mood, 0);
    return total / MOOD_TREND_DATA.length;
  }, []);

  const moodVariation = useMemo(() => {
    const first = MOOD_TREND_DATA[0];
    const last = MOOD_TREND_DATA[MOOD_TREND_DATA.length - 1];
    return last.mood - first.mood;
  }, []);

  const bestMoodDay = useMemo(() => {
    return MOOD_TREND_DATA.reduce((best, current) => (current.mood > best.mood ? current : best));
  }, []);

  const weeklySessions = useMemo(() => {
    return WEEKLY_SESSIONS_DATA.map((entry) => ({
      ...entry,
      total: entry.guided + entry.breathwork + entry.vr + entry.journaling,
    }));
  }, []);

  const sessionsAverage = useMemo(() => {
    const total = weeklySessions.reduce((acc, week) => acc + week.total, 0);
    return total / weeklySessions.length;
  }, [weeklySessions]);

  const lastWeek = weeklySessions[weeklySessions.length - 1];

  const mostIntenseSlot = useMemo(() => {
    return HEATMAP_DATA.reduce((best, current) => (current.intensity > best.intensity ? current : best));
  }, []);

  return (
    <section aria-label="Scores V2" className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Scores</h1>
          <p className="text-muted-foreground">Progression, streaks et badges</p>
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
          <Button variant="outline" size="sm" className="ml-auto md:ml-0" data-ui="refresh">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Évolution de l'humeur</CardTitle>
            <CardDescription>10 derniers jours, corrélation énergie & activités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Humeur moyenne</p>
                <p className="text-2xl font-semibold">{moodAverage.toFixed(1)}/10</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Variation</p>
                <p className={cn("text-2xl font-semibold", moodVariation >= 0 ? "text-emerald-600" : "text-red-500")}
                >
                  {moodVariation >= 0 ? "+" : ""}{moodVariation.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Pic émotionnel</p>
                <p className="text-2xl font-semibold">{formatDate(bestMoodDay.date)}</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOOD_TREND_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={axisColor} tickFormatter={formatDate} />
                  <YAxis stroke={axisColor} domain={[5, 10]} tickCount={6} />
                  <Tooltip content={<MoodTooltip />} cursor={{ stroke: "rgba(99, 102, 241, 0.35)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="mood" name="Humeur" stroke={moodLineColor} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="energy" name="Énergie" stroke={energyLineColor} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
              <p className="text-xs text-muted-foreground">Encore {nextLevelExperience - currentExperience} pts avant le niveau 4.</p>
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
                  <p className="text-xs text-muted-foreground">{lastWeek.total} séances réalisées cette semaine</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Séances par semaine</CardTitle>
            <CardDescription>Répartition guidée, respiration, VR et journal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Moyenne</p>
                <p className="text-2xl font-semibold">{sessionsAverage.toFixed(1)} séances</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Semaine max</p>
                <p className="text-2xl font-semibold">{lastWeek.week}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Guidées</p>
                <p className="text-2xl font-semibold">{lastWeek.guided}</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
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
              <p className="text-sm text-muted-foreground">{mostIntenseSlot.sessions} séances, vibe {mostIntenseSlot.dominantMood.toLowerCase()}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Pic d'énergie</span>
                <span>{formatDate(bestMoodDay.date)}</span>
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
          <CardTitle>Heatmap Vibes</CardTitle>
          <CardDescription>Intensité émotionnelle par moment clé de la journée</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis type="category" dataKey="slot" stroke={axisColor} allowDuplicatedCategory={false} />
                <YAxis type="category" dataKey="day" stroke={axisColor} width={60} />
                <Tooltip content={<HeatmapTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.4)", strokeWidth: 1 }} />
                <Scatter data={HEATMAP_DATA} shape={(props) => <HeatmapCell {...props} />}>
                  {HEATMAP_DATA.map((entry) => (
                    <Cell key={`${entry.day}-${entry.slot}`} fill={getHeatmapColor(entry.intensity)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </section>
  );
};

export default ScoresV2Panel;
