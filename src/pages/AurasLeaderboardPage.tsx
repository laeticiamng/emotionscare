/**
 * AurasLeaderboardPage - Page du ciel d'auras (/app/leaderboard)
 * Affiche un classement visuel sans chiffres, basé sur les auras
 */
import { useEffect, useState, useRef, useMemo } from 'react';
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AurasGalaxy,
  LeaderboardStats,
  MyAuraCard,
  AuraTimeFilter,
  AuraHistoryChart,
  AuraFullscreenToggle,
  useAurasLeaderboard,
  type TimeRange,
} from '@/features/leaderboard';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, startOfMonth, subWeeks } from 'date-fns';

interface AuraHistoryEntry {
  weekStart: string;
  weekEnd: string;
  colorHue: number;
  luminosity: number;
  sizeScale: number;
}

const AurasLeaderboardPage = () => {
  const navigate = useNavigate();
  const { auras, myAura, loading } = useAurasLeaderboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [myHistory, setMyHistory] = useState<AuraHistoryEntry[]>([]);
  const galaxyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Le Ciel des Auras | EmotionsCare';
  }, []);

  // Fetch my aura history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;

      const { data } = await supabase
        .from('aura_history')
        .select('week_start, week_end, color_hue, luminosity, size_scale')
        .eq('user_id', userData.user.id)
        .order('week_start', { ascending: true })
        .limit(12);

      if (data) {
        setMyHistory(
          data.map((row) => ({
            weekStart: row.week_start,
            weekEnd: row.week_end,
            colorHue: row.color_hue,
            luminosity: row.luminosity > 1 ? row.luminosity / 100 : row.luminosity,
            sizeScale: row.size_scale,
          }))
        );
      }
    };

    fetchHistory();
  }, []);

  // Filter auras by time range
  const filteredAuras = useMemo(() => {
    if (timeRange === 'all') return auras;

    const now = new Date();
    const cutoff =
      timeRange === 'week'
        ? startOfWeek(now, { weekStartsOn: 1 })
        : startOfMonth(now);

    return auras.filter((a) => {
      if (!a.lastUpdated) return true;
      return new Date(a.lastUpdated) >= cutoff;
    });
  }, [auras, timeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Aller au contenu principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="text-lg font-semibold text-foreground">
            Le Ciel des Auras
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <AuraFullscreenToggle targetRef={galaxyRef} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Aide">
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm">
                  Ce n'est pas un classement traditionnel. Chaque aura représente
                  un explorateur. La couleur reflète votre état émotionnel, la
                  taille votre régularité. Pas de rang, juste un spectacle
                  cosmique de progression douce.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main id="main-content" role="main" className="container mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Un ciel rempli d'auras colorées
          </h2>
          <p className="text-muted-foreground">
            Pas de classement. Pas de chiffres. Juste votre aura qui flotte,
            change de couleur, et devient plus chaude chaque semaine. Un
            spectacle cosmique de progression douce.
          </p>
        </section>

        {/* Time Filter */}
        <div className="flex justify-center">
          <AuraTimeFilter value={timeRange} onChange={setTimeRange} />
        </div>

        {/* Stats */}
        <LeaderboardStats auras={filteredAuras} />

        {/* My Aura Card */}
        <MyAuraCard aura={myAura} />

        {/* My Aura History */}
        {myHistory.length > 0 && <AuraHistoryChart history={myHistory} />}

        {/* Galaxy */}
        <div ref={galaxyRef}>
          <AurasGalaxy minHeight="500px" showHeader={false} />
        </div>

        {/* Explanation */}
        <section className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Comment fonctionne le Ciel des Auras ?
          </h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p className="font-medium text-foreground">🎨 Couleur</p>
              <p>
                Votre score WHO-5 influence la teinte. Bleu/violet pour l'énergie
                calme, vert pour l'équilibre, orange/jaune pour la vitalité.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">✨ Luminosité</p>
              <p>
                Plus votre bien-être est élevé, plus votre aura brille
                intensément dans le ciel.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">📏 Taille</p>
              <p>
                Votre régularité (streak de jours consécutifs) fait grandir
                votre présence dans le ciel collectif.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AurasLeaderboardPage;
