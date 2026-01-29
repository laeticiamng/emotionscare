import { useState, useEffect } from 'react';
import { WellnessGamificationPanel } from '@/components/gamification/WellnessGamificationPanel';
import { WellnessStreakDisplay } from '@/components/gamification/WellnessStreakDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Calendar, Target, TrendingUp } from 'lucide-react';

export default function BadgesPage() {
  // Stats globales depuis localStorage
  const [globalStats, setGlobalStats] = useState({
    totalBadges: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivity: null as string | null
  });
  
  useEffect(() => {
    // Charger les stats depuis différentes sources localStorage
    const meditationStats = JSON.parse(localStorage.getItem('meditation_stats') || '{}');
    const claimedMilestones = ['3', '7', '14', '30', '60', '100'].filter(
      d => localStorage.getItem(`milestone_claimed_${d}`) === 'true'
    ).length;
    
    setGlobalStats({
      totalBadges: claimedMilestones,
      totalPoints: (meditationStats.totalSessions || 0) * 10 + claimedMilestones * 50,
      currentStreak: 0, // Sera mis à jour par le composant
      longestStreak: meditationStats.longestSession || 0,
      lastActivity: meditationStats.lastSession
    });
  }, []);

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gamification Bien-être</h1>
              <p className="text-muted-foreground">
                Système d'énergie émotionnelle • Encourage l'auto-bienveillance
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold">{globalStats.totalBadges}</p>
                    <p className="text-xs text-muted-foreground">Badges débloqués</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{globalStats.totalPoints}</p>
                    <p className="text-xs text-muted-foreground">Points Harmonie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{globalStats.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">Record (min)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {globalStats.lastActivity 
                        ? new Date(globalStats.lastActivity).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                        : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground">Dernière activité</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Streak Header */}
          <Card>
            <CardContent className="pt-6">
              <WellnessStreakDisplay showCheckin />
            </CardContent>
          </Card>
        </header>

        {/* Main Gamification Panel */}
        <WellnessGamificationPanel />

        {/* Info Section */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="py-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">💜 Système d'Énergie Émotionnelle</h3>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <h4 className="font-medium mb-2">⚡ Comment ça marche ?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• L'énergie se recharge naturellement (1 point/4h)</li>
                    <li>• Complète des quêtes pour gagner de l'énergie</li>
                    <li>• Utilise des boosts quand tu es bas en énergie</li>
                    <li>• Maintiens ta série quotidienne</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">✨ Points Harmonie</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Monnaie interne de bien-être</li>
                    <li>• Débloque des thèmes et musiques</li>
                    <li>• Accède à des analyses avancées</li>
                    <li>• Offre de l'énergie à tes amis</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
