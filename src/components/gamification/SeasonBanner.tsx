// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Star, Trophy, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const SeasonBanner: React.FC = () => {
  const [rulesOpen, setRulesOpen] = useState(false);

  // Mock season data - would come from API
  const currentSeason = {
    name: 'Saison Nova',
    theme: 'Exploration cosmique',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    progress: 65, // Pourcentage d'avancement dans la saison
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getRemainingDays = () => {
    const now = new Date();
    const diff = currentSeason.endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {currentSeason.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentSeason.theme} • {formatDate(currentSeason.startDate)} - {formatDate(currentSeason.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {getRemainingDays()} jours restants
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Saison active
                </Badge>
              </div>
            </div>

            <Dialog open={rulesOpen} onOpenChange={setRulesOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Analytics
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'gami_season_view');
                    }
                  }}
                >
                  <Info className="w-4 h-4" />
                  Règles
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    {currentSeason.name} - Règles du jeu
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Thème: {currentSeason.theme}</h3>
                    <p className="text-sm text-muted-foreground">
                      Durant cette saison, explorez de nouveaux horizons et découvrez des fonctionnalités 
                      inédites. Chaque action vous rapproche des étoiles !
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Comment gagner des points :</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-green-600">+1</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Connexion quotidienne</p>
                            <p className="text-xs text-muted-foreground">Se connecter chaque jour</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">+3</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Module terminé</p>
                            <p className="text-xs text-muted-foreground">Compléter un exercice</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-600">+5</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Objectif hebdo</p>
                            <p className="text-xs text-muted-foreground">Atteindre ses objectifs</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-orange-600">+10</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Nouveau badge</p>
                            <p className="text-xs text-muted-foreground">Débloquer un badge</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Récompenses de fin de saison</h4>
                    <p className="text-sm text-muted-foreground">
                      Les meilleurs explorateurs recevront des badges exclusifs et l'accès anticipé 
                      aux nouvelles fonctionnalités de la prochaine saison !
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};