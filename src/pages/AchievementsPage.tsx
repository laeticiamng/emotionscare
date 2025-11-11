// @ts-nocheck
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy, Star, Calendar, Share2, Download, TrendingUp,
  Target, Award, Sparkles, ArrowLeft, Lock, CheckCircle2
} from 'lucide-react';
import { useAttractionProgress } from '@/hooks/useAttractionProgress';
import { useRewards } from '@/hooks/useRewards';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useToast } from '@/hooks/use-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AchievementsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { visitedAttractions, unlockedBadges } = useAttractionProgress();
  const rewards = useRewards(unlockedBadges.length);

  const stats = useMemo(() => {
    const totalVisits = Object.keys(visitedAttractions).length;
    const totalBadges = unlockedBadges.length;
    const totalRewards = rewards.unlockedAvatars.length + rewards.unlockedThemes.length + rewards.unlockedParticles.length;

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        visits: Math.floor(Math.random() * 5) + (i * 2)
      };
    });

    return {
      totalVisits,
      totalBadges,
      totalRewards,
      weeklyData,
      completionRate: Math.round((totalBadges / 8) * 100)
    };
  }, [visitedAttractions, unlockedBadges, rewards]);

  const timeline = useMemo(() => {
    return unlockedBadges
      .sort((a, b) => b.unlockedAt - a.unlockedAt)
      .map(badge => ({
        ...badge,
        date: new Date(badge.unlockedAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        time: new Date(badge.unlockedAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
  }, [unlockedBadges]);

  const weeklyChartData = {
    labels: stats.weeklyData.map(d => d.date),
    datasets: [
      {
        label: 'Attractions visitées',
        data: stats.weeklyData.map(d => d.visits),
        fill: true,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        tension: 0.4
      }
    ]
  };

  const badgesChartData = {
    labels: ['Badges débloqués', 'Badges restants'],
    datasets: [
      {
        data: [stats.totalBadges, 8 - stats.totalBadges],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--muted))'
        ],
        borderWidth: 0
      }
    ]
  };

  const rewardsChartData = {
    labels: ['Avatars', 'Thèmes', 'Effets'],
    datasets: [
      {
        label: 'Récompenses débloquées',
        data: [
          rewards.unlockedAvatars.length,
          rewards.unlockedThemes.length,
          rewards.unlockedParticles.length
        ],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--accent))'
        ]
      }
    ]
  };

  const handleShare = () => {
    const text = `🏆 J'ai débloqué ${stats.totalBadges} badges dans le Parc Émotionnel ! ${stats.completionRate}% de complétion. Rejoins-moi sur EmotionsCare ! ✨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mes Achievements EmotionsCare',
        text: text
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le texte a été copié dans votre presse-papier"
      });
    }
  };

  const handleDownload = () => {
    const data = {
      stats,
      badges: unlockedBadges,
      rewards: {
        avatars: rewards.unlockedAvatars,
        themes: rewards.unlockedThemes,
        particles: rewards.unlockedParticles
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-achievements-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Téléchargé !",
      description: "Vos achievements ont été exportés"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/90 border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/app/emotional-park')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Trophy className="h-8 w-8 text-primary" />
                  Mes Achievements
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ton parcours dans le Parc Émotionnel
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Attractions visitées</p>
                    <p className="text-3xl font-bold">{stats.totalVisits}</p>
                  </div>
                  <Target className="h-10 w-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Badges débloqués</p>
                    <p className="text-3xl font-bold">{stats.totalBadges}/8</p>
                  </div>
                  <Trophy className="h-10 w-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Récompenses</p>
                    <p className="text-3xl font-bold">{stats.totalRewards}</p>
                  </div>
                  <Award className="h-10 w-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Complétion</p>
                    <p className="text-3xl font-bold">{stats.completionRate}%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">
              <Calendar className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Sparkles className="h-4 w-4 mr-2" />
              Récompenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Badges</CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Commence à explorer le Parc Émotionnel pour débloquer des badges !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((badge, index) => (
                      <motion.div
                        key={badge.zoneKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-accent/50"
                      >
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{badge.zoneName}</h4>
                            <Badge variant="secondary">{badge.totalAttractions} attractions</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Débloqué le {badge.date} à {badge.time}
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progression Hebdomadaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line
                    data={weeklyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Badges</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="w-64">
                    <Doughnut
                      data={badgesChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Récompenses Débloquées</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={rewardsChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {rewards.availableAvatars.map((avatar) => {
                    const isUnlocked = rewards.unlockedAvatars.includes(avatar.id);
                    const isSelected = rewards.selectedAvatar === avatar.id;

                    return (
                      <motion.div
                        key={avatar.id}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        className={`
                          p-4 rounded-xl border-2 text-center cursor-pointer transition-all
                          ${isSelected ? 'border-primary bg-primary/10' : 'border-border'}
                          ${!isUnlocked && 'opacity-50 cursor-not-allowed'}
                        `}
                        onClick={() => isUnlocked && rewards.selectAvatar(avatar.id)}
                      >
                        <div className="text-4xl mb-2">{isUnlocked ? avatar.emoji : '🔒'}</div>
                        <p className="font-semibold text-sm mb-1">{avatar.name}</p>
                        <Badge variant={isUnlocked ? 'default' : 'secondary'} className="text-xs">
                          {avatar.rarity}
                        </Badge>
                        {!isUnlocked && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {avatar.unlockRequirement} badges requis
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thèmes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.availableThemes.map((theme) => {
                    const isUnlocked = rewards.unlockedThemes.includes(theme.id);
                    const isSelected = rewards.selectedTheme === theme.id;

                    return (
                      <motion.div
                        key={theme.id}
                        whileHover={isUnlocked ? { scale: 1.02 } : {}}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${isSelected ? 'border-primary' : 'border-border'}
                          ${!isUnlocked && 'opacity-50 cursor-not-allowed'}
                        `}
                        onClick={() => isUnlocked && rewards.selectTheme(theme.id)}
                      >
                        <div className={`h-20 rounded-lg mb-3 bg-gradient-to-br ${theme.gradient}`} />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{theme.name}</p>
                            <Badge variant={isUnlocked ? 'default' : 'secondary'} className="text-xs mt-1">
                              {theme.rarity}
                            </Badge>
                          </div>
                          {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
