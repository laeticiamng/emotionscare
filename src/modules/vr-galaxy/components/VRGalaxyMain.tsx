/**
 * Composant principal enrichi du module VR Galaxy
 * Interface complète avec onglets, stats, historique et achievements
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Pause, RotateCcw, Settings, History, Trophy, BarChart3, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useVRGalaxy } from '../hooks/useVRGalaxy';
import { GalaxyStatsPanel } from './GalaxyStatsPanel';
import { GalaxySessionHistoryPanel } from './GalaxySessionHistoryPanel';
import { GalaxyAchievementsPanel } from './GalaxyAchievementsPanel';
import { GalaxySettingsPanel } from './GalaxySettingsPanel';
import { cn } from '@/lib/utils';

interface VRGalaxyMainProps {
  className?: string;
}

export const VRGalaxyMain: React.FC<VRGalaxyMainProps> = ({ className = '' }) => {
  const galaxy = useVRGalaxy();
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExport = async () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      stats: galaxy.stats,
      sessionHistory: galaxy.sessionHistory,
      achievements: galaxy.achievements.filter(a => a.unlocked),
      constellations: galaxy.constellations.filter(c => c.unlocked)
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vr-galaxy-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header avec streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">VR Galaxy</h1>
          {galaxy.stats.currentStreak > 0 && (
            <Badge variant="secondary" className="gap-1">
              🔥 {galaxy.stats.currentStreak} jours
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Zone principale - Session active ou démarrage */}
      <Card className="bg-gradient-to-br from-slate-900/50 via-blue-900/20 to-slate-900/50 border-border/50">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {galaxy.isImmersed ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Timer et stats de session */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="text-primary">
                      {galaxy.galaxyType}
                    </Badge>
                  </div>

                  <div className="text-5xl font-bold text-foreground tabular-nums">
                    {formatTime(galaxy.currentSessionDuration)}
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      {galaxy.currentBreaths} respirations
                    </span>
                    <span>
                      Max: {galaxy.settings.sessionDuration} min
                    </span>
                  </div>

                  <Progress
                    value={(galaxy.currentSessionDuration / (galaxy.settings.sessionDuration * 60)) * 100}
                    className="h-2"
                  />
                </div>

                {/* Constellations en cours */}
                <div className="relative h-40 bg-slate-800/30 rounded-2xl overflow-hidden">
                  {galaxy.constellations.map((constellation) => (
                    <div key={constellation.id} className="absolute inset-0">
                      {constellation.stars.map((star, idx) => (
                        <motion.div
                          key={idx}
                          className={cn(
                            'absolute w-2 h-2 rounded-full',
                            constellation.unlocked ? 'bg-primary' : 'bg-muted/30'
                          )}
                          style={{ left: `${star.x}%`, top: `${star.y}%` }}
                          animate={constellation.unlocked ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Contrôles */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={galaxy.pauseSession}
                    className="gap-2"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={galaxy.endSession}
                    className="gap-2 bg-primary"
                  >
                    Terminer la session
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      galaxy.exitGalaxy();
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 py-8"
              >
                <div className="space-y-2">
                  <Sparkles className="h-12 w-12 mx-auto text-primary opacity-80" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Voyage dans les étoiles
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Respire calmement et regarde les constellations naître au fil de ta pratique
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={galaxy.startSession}
                  className="gap-2 bg-primary hover:bg-primary/90 px-8"
                >
                  <Play className="h-5 w-5" />
                  Commencer le voyage
                </Button>

                {/* Stats rapides */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                  <span>{galaxy.stats.totalSessions} sessions</span>
                  <span>•</span>
                  <span>{galaxy.stats.totalMinutes} min explorées</span>
                  <span>•</span>
                  <span>{galaxy.stats.constellationsUnlocked}/{galaxy.stats.totalConstellations} constellations</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Onglets : Stats, Historique, Achievements */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique ({galaxy.sessionHistory.length})
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <GalaxyStatsPanel stats={galaxy.stats} />
        </TabsContent>

        <TabsContent value="history">
          <GalaxySessionHistoryPanel
            sessions={galaxy.sessionHistory}
            onSessionSelect={(session) => console.log('Selected session:', session)}
          />
        </TabsContent>

        <TabsContent value="achievements">
          <GalaxyAchievementsPanel achievements={galaxy.achievements} />
        </TabsContent>
      </Tabs>

      {/* Modal Settings */}
      {showSettings && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Paramètres</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <GalaxySettingsPanel
                settings={galaxy.settings}
                onSettingsChange={galaxy.updateSettings}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VRGalaxyMain;
