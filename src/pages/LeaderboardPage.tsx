// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Star, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { entries, myEntry, loading, refresh } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
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
                  Leaderboard Communautaire
                </h1>
                <p className="text-sm text-muted-foreground">
                  Classement anonyme des explorateurs du Parc Émotionnel
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {myEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Ma Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(myEntry.rank || 0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{myEntry.pseudo_anonyme}</p>
                      <p className="text-sm text-muted-foreground">
                        {myEntry.total_badges} badges débloqués
                      </p>
                    </div>
                  </div>
                  {myEntry.monthly_badge && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Top 10%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Top 100 Explorateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !entries.length ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Chargement du classement...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Sois le premier à rejoindre le leaderboard !
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      flex items-center justify-between p-4 rounded-lg transition-colors
                      ${entry.id === myEntry?.id ? 'bg-primary/10 border border-primary/50' : 'hover:bg-accent/50'}
                    `}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank || index + 1)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${entry.id === myEntry?.id ? 'text-primary' : ''}`}>
                            {entry.pseudo_anonyme}
                          </p>
                          {entry.monthly_badge && (
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Top 10%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.total_badges} badges
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {entry.total_badges >= 8 && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500">
                          Maître Absolu
                        </Badge>
                      )}
                      {entry.total_badges >= 5 && entry.total_badges < 8 && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500">
                          Expert
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Classement anonyme :</strong> Ton pseudo est généré aléatoirement pour protéger ton identité.
                  </p>
                  <p>
                    <strong>Top 10% :</strong> Les meilleurs explorateurs reçoivent un badge spécial chaque mois.
                  </p>
                  <p>
                    <strong>Mise à jour :</strong> Le classement est recalculé automatiquement après chaque nouveau badge débloqué.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
