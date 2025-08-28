import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Flame, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CBossLevelGritPage: React.FC = () => {
  const [gritLevel, setGritLevel] = useState(72);
  const [isTraining, setIsTraining] = useState(false);
  const [achievements, setAchievements] = useState(['Déterminé', 'Résilient']);
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingStates.Loading text="Chargement Boss Level..." />;
  if (loadingState === 'error') return <LoadingStates.Error message="Erreur de chargement" />;

  const handleTraining = () => {
    setIsTraining(true);
    setTimeout(() => {
      setGritLevel(prev => Math.min(100, prev + 8));
      setIsTraining(false);
      if (gritLevel >= 90 && !achievements.includes('Boss Level')) {
        setAchievements(prev => [...prev, 'Boss Level']);
      }
    }, 2000);
  };

  const challengesMastered = Math.floor(gritLevel / 15);
  const nextMilestone = Math.ceil(gritLevel / 25) * 25;

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold">Boss Level Grit</h1>
          <p className="text-muted-foreground">Développez votre détermination ultime</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Principal Grit */}
        <Card className="relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5"
            animate={isTraining ? { scale: 1.02 } : { scale: 1 }}
          />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-red-500" />
              Niveau de Détermination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <motion.div
                animate={isTraining ? { scale: 1.1 } : { scale: 1 }}
                className="text-6xl font-bold text-amber-500 mb-2"
              >
                {gritLevel}%
              </motion.div>
              <Progress value={gritLevel} className="w-full h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Prochain palier: {nextMilestone}%
              </p>
            </div>

            <Button 
              onClick={handleTraining}
              disabled={isTraining}
              size="lg"
              className="w-full"
              variant={gritLevel >= 90 ? "default" : "outline"}
            >
              {isTraining ? (
                <>
                  <Zap className="h-5 w-5 mr-2 animate-spin" />
                  Entraînement en cours...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Entraîner la Détermination
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-amber-500">{challengesMastered}</div>
                <div className="text-sm text-muted-foreground">Défis Maîtrisés</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-500">{100 - gritLevel}</div>
                <div className="text-sm text-muted-foreground">Points Restants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Accomplissements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <AnimatePresence>
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant={achievement === 'Boss Level' ? 'default' : 'secondary'}
                      className="w-full justify-center py-2"
                    >
                      {achievement === 'Boss Level' && <Trophy className="h-4 w-4 mr-2" />}
                      {achievement}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Prochains Objectifs</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Guerrier</span>
                  <span className="text-xs text-muted-foreground">80%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Champion</span>
                  <span className="text-xs text-muted-foreground">90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-amber-600">Boss Final</span>
                  <span className="text-xs text-amber-600 font-semibold">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Défis du jour */}
      <Card>
        <CardHeader>
          <CardTitle>Défis Grit du Jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="text-lg mb-2">🎯 Défi Focus</div>
              <h4 className="font-semibold text-sm">Méditation 10min</h4>
              <p className="text-xs text-muted-foreground">Restez concentré sans interruption</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="text-lg mb-2">💪 Défi Physique</div>
              <h4 className="font-semibold text-sm">20 Pompes</h4>
              <p className="text-xs text-muted-foreground">Développez votre force mentale</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="text-lg mb-2">🧠 Défi Mental</div>
              <h4 className="font-semibold text-sm">Problème Complexe</h4>
              <p className="text-xs text-muted-foreground">Persévérez face à la difficulté</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CBossLevelGritPage;