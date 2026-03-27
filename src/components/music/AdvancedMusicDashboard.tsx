// @ts-nocheck
/**
 * Advanced Music Dashboard - Dashboard complet avec tous les nouveaux composants
 * Intègre: Offline Mode, 3D Visualizations, Contextual Recommendations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';
import {
  WifiOff,
  Volume2,
  Sparkles,
  Settings2,
} from 'lucide-react';
import { OfflineModeManager } from './OfflineModeManager';
import { Audio3DVisualizer } from './Audio3DVisualizer';
import { ContextualRecommendations } from './ContextualRecommendations';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
  category: string;
  color: string;
  vinylColor: string;
  description: string;
}

interface AdvancedMusicDashboardProps {
  tracks: MusicTrack[];
  isPlaying?: boolean;
  currentTrack?: MusicTrack;
  onTrackSelect?: (track: MusicTrack) => void;
}

export const AdvancedMusicDashboard: React.FC<AdvancedMusicDashboardProps> = ({
  tracks,
  isPlaying = false,
  currentTrack,
  onTrackSelect,
}) => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [currentWeather, setCurrentWeather] = useState<'sunny' | 'cloudy' | 'rainy' | 'snowy'>('sunny');
  const [userActivityLevel, setUserActivityLevel] = useState<'rest' | 'light' | 'moderate' | 'intense'>('moderate');

  // Simulated frequency data
  const frequencyData = Array(64)
    .fill(0)
    .map(() => Math.random() * 100);

  const waveformData = Array(100)
    .fill(0)
    .map(() => Math.sin(Math.random() * Math.PI) * 50 + 50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Tableau de Bord Musical Avancé
          </h2>
          <p className="text-muted-foreground">
            Explorez les nouvelles fonctionnalités: Offline, 3D, et Recommandations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Titres en cache</p>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Espace utilisé</p>
              <p className="text-2xl font-bold">0MB</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Mode actif</p>
              <p className="text-2xl font-bold">
                {isPlaying ? '🎵' : '⏸️'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Météo</p>
              <p className="text-2xl font-bold">
                {currentWeather === 'sunny' && '☀️'}
                {currentWeather === 'cloudy' && '☁️'}
                {currentWeather === 'rainy' && '🌧️'}
                {currentWeather === 'snowy' && '❄️'}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="visualizer" className="gap-2 text-xs">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">3D Visuel</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2 text-xs">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Recommandations</span>
          </TabsTrigger>
          <TabsTrigger value="offline" className="gap-2 text-xs">
            <WifiOff className="h-4 w-4" />
            <span className="hidden sm:inline">Mode Offline</span>
          </TabsTrigger>
        </TabsList>

        {/* Visualizer Tab */}
        <TabsContent value="visualizer" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Audio3DVisualizer
              isPlaying={isPlaying}
              frequency={frequencyData}
              waveform={waveformData}
              trackTitle={currentTrack?.title || 'Titre inconnu'}
              trackArtist={currentTrack?.artist || 'Artiste inconnu'}
              trackMood={currentTrack?.mood || 'Neutre'}
              trackColor={currentTrack?.color || '#3b82f6'}
            />
          </motion.div>

          {/* Visualizer Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">À propos des visualisations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Barres:</strong> Affiche le spectre audio en temps réel avec des barres animées
              </p>
              <p>
                <strong>Onde:</strong> Représentation fluide de la forme d'onde de la musique
              </p>
              <p>
                <strong>Particules:</strong> Effet de particules qui dansent avec la musique
              </p>
              <p>
                <strong>Spectre:</strong> Visualisation circulaire en temps réel de la fréquence
              </p>
              <p>
                <strong>Circulaire:</strong> Représentation 3D-like circulaire et pulsante
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContextualRecommendations
              currentWeather={currentWeather}
              userActivityLevel={userActivityLevel}
              onPlaylistSelect={(playlist) => {
                logger.debug('Selected playlist:', playlist, 'COMPONENT');
              }}
            />
          </motion.div>

          {/* Weather and Activity Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurer le contexte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Météo:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { value: 'sunny', label: '☀️ Ensoleillé' },
                      { value: 'cloudy', label: '☁️ Nuageux' },
                      { value: 'rainy', label: '🌧️ Pluvieux' },
                      { value: 'snowy', label: '❄️ Neige' },
                    ] as const
                  ).map((weather) => (
                    <button
                      key={weather.value}
                      onClick={() =>
                        setCurrentWeather(
                          weather.value as
                            | 'sunny'
                            | 'cloudy'
                            | 'rainy'
                            | 'snowy'
                        )
                      }
                      className={`p-2 rounded text-xs font-medium transition-all ${
                        currentWeather === weather.value
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {weather.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau d'activité:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { value: 'rest', label: 'Repos' },
                      { value: 'light', label: 'Léger' },
                      { value: 'moderate', label: 'Modéré' },
                      { value: 'intense', label: 'Intense' },
                    ] as const
                  ).map((activity) => (
                    <button
                      key={activity.value}
                      onClick={() =>
                        setUserActivityLevel(
                          activity.value as
                            | 'rest'
                            | 'light'
                            | 'moderate'
                            | 'intense'
                        )
                      }
                      className={`p-2 rounded text-xs font-medium transition-all ${
                        userActivityLevel === activity.value
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {activity.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comment ça marche?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>📅 Temps:</strong> Les recommandations changent automatiquement
                toutes les heures (matin, après-midi, soirée, nuit)
              </p>
              <p>
                <strong>🌤️ Météo:</strong> La météo influence le type de musique suggérée
                (IA basée sur le contexte)
              </p>
              <p>
                <strong>⚡ Activité:</strong> Votre niveau d'activité affecte les
                recommandations (repos, léger, modéré, intense)
              </p>
              <p>
                <strong>🤖 ML:</strong> Machine learning pour adapter les
                recommandations à votre profil
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offline Tab */}
        <TabsContent value="offline" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OfflineModeManager
              tracks={tracks}
              onDownload={(trackId) => {
                logger.debug('Downloaded track:', trackId, 'COMPONENT');
              }}
              onRemoveFromCache={(trackId) => {
                logger.debug('Removed from cache:', trackId, 'COMPONENT');
              }}
            />
          </motion.div>

          {/* Offline Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fonctionnalités Offline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                  <p className="font-medium text-sm">📥 Téléchargement</p>
                  <p className="text-xs text-muted-foreground">
                    Téléchargez les titres pour les écouter hors ligne
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                  <p className="font-medium text-sm">💾 Cache Intelligent</p>
                  <p className="text-xs text-muted-foreground">
                    Gestion automatique de l'espace avec limite configurable
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                  <p className="font-medium text-sm">📡 Auto-Sync</p>
                  <p className="text-xs text-muted-foreground">
                    Synchronisation automatique quand la connexion revient
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                  <p className="font-medium text-sm">🔄 Sync Manuel</p>
                  <p className="text-xs text-muted-foreground">
                    Synchroniser quand vous le souhaitez
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gestion du Stockage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Limite:</strong> 500 MB par défaut (configurable)
              </p>
              <p>
                <strong>Taille estimée:</strong> ~5 MB par titre
              </p>
              <p>
                <strong>Nettoyage:</strong> Supprimez les titres ou videz le cache
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMusicDashboard;
