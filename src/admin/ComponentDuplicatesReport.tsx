import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle, CheckCircle, Music } from 'lucide-react';

/**
 * Rapport des doublons détectés dans les composants
 */
export default function ComponentDuplicatesReport() {
  const musicPlayerDuplicates = [
    { 
      category: 'Music Players', 
      duplicates: [
        { path: 'src/components/music/MusicPlayer.tsx', lines: 241, type: 'Basique avec contrôles' },
        { path: 'src/components/music/player/MusicPlayer.tsx', lines: 81, type: 'Version simplifiée' },
        { path: 'src/components/music/AdaptiveMusicPlayer.tsx', lines: 158, type: 'Adaptatif par émotion' },
        { path: 'src/components/music/AnimatedMusicPlayer.tsx', lines: 264, type: 'Avec animations' },
        { path: 'src/components/music/AutoMusicPlayer.tsx', lines: 159, type: 'Automatique' },
        { path: 'src/components/music/MusicPlayerDemo.tsx', lines: 127, type: 'Démonstration' },
        { path: 'src/components/music/PlayerWithMood.tsx', lines: 327, type: 'Avec mood tracking' },
        { path: 'src/components/music/player/SimpleMusicPlayer.tsx', lines: 46, type: 'Simple minimal' },
        { path: 'src/components/music/player/EnhancedMusicPlayer.tsx', lines: 260, type: 'Version avancée' },
        { path: 'src/components/music/player/PremiumMusicPlayer.tsx', lines: 249, type: 'Premium avec tabs' }
      ],
      recommendation: 'Garder PremiumMusicPlayer.tsx comme principal, adapter selon besoins'
    },
    {
      category: 'Music Recommendations',
      duplicates: [
        { path: 'src/components/music/EmotionBasedMusicRecommendation.tsx', lines: 75, type: 'Basé sur émotion' },
        { path: 'src/components/music/EnhancedMusicRecommendations.tsx', lines: 145, type: 'Version enrichie' },
        { path: 'src/components/music/MoodBasedRecommendations.tsx', lines: 72, type: 'Basé sur humeur' },
        { path: 'src/components/music/OptimizedMusicRecommendation.tsx', lines: '?', type: 'Version optimisée' }
      ],
      recommendation: 'Garder EnhancedMusicRecommendations.tsx comme principal'
    },
    {
      category: 'Mini Players',
      duplicates: [
        { path: 'src/components/music/MusicMiniPlayer.tsx', lines: 92, type: 'Mini player standard' },
        { path: 'src/components/music/player/MiniPlayer.tsx', lines: 55, type: 'Mini player dans player/' }
      ],
      recommendation: 'Garder MusicMiniPlayer.tsx dans racine music/'
    },
    {
      category: 'Player Controls',
      duplicates: [
        { path: 'src/components/music/player/PlayerControls.tsx', lines: 70, type: 'Contrôles player/' },
        { path: 'src/components/music/player/MusicControls.tsx', lines: 84, type: 'Contrôles music/' }
      ],
      recommendation: 'Garder PlayerControls.tsx, supprimer MusicControls.tsx'
    },
    {
      category: 'Visualizers',
      duplicates: [
        { path: 'src/components/music/MusicVisualizer.tsx', type: 'Visualiseur basique' },
        { path: 'src/components/music/EnhancedMusicVisualizer.tsx', type: 'Visualiseur avancé' },
        { path: 'src/components/music/EmotionMusicVisualizer.tsx', type: 'Visualiseur émotionnel' }
      ],
      recommendation: 'Garder EnhancedMusicVisualizer.tsx comme principal'
    }
  ];

  const totalDuplicates = musicPlayerDuplicates.reduce((acc, category) => acc + category.duplicates.length, 0);
  const estimatedCleanup = '~15+ fichiers à supprimer';
  const spaceSaving = '~300KB';

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-orange-600">
          🚨 Doublons Détectés dans les Composants
        </h1>
        <p className="text-muted-foreground">
          Analyse des composants musicaux - Nettoyage requis
        </p>
      </div>

      {/* Résumé des doublons */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <strong>{totalDuplicates} composants dupliqués</strong> détectés dans src/components/music/
            </div>
            <div className="text-right">
              <div className="text-sm">Nettoyage estimé: {estimatedCleanup}</div>
              <div className="text-sm">Espace libéré: {spaceSaving}</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Détail des doublons par catégorie */}
      {musicPlayerDuplicates.map((category, index) => (
        <Card key={index} className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-orange-500" />
              {category.category}
              <Badge variant="outline" className="ml-auto">
                {category.duplicates.length} doublons
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.duplicates.map((duplicate, dupIndex) => (
                <div key={dupIndex} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-mono text-sm">{duplicate.path}</div>
                    <div className="text-xs text-muted-foreground">{duplicate.type}</div>
                  </div>
                  <div className="text-right">
                    {duplicate.lines && (
                      <div className="text-sm text-muted-foreground">{duplicate.lines} lignes</div>
                    )}
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              ))}
              
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <strong>Recommandation:</strong>
                </div>
                <p className="text-sm text-green-600 mt-1">{category.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Plan d'action */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">Plan de Nettoyage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700">
            <p>1. <strong>Analyser les imports</strong> pour identifier les composants utilisés</p>
            <p>2. <strong>Garder le composant le plus complet</strong> de chaque catégorie</p>
            <p>3. <strong>Supprimer les doublons</strong> moins développés ou spécialisés</p>
            <p>4. <strong>Mettre à jour les imports</strong> dans les fichiers utilisant les composants supprimés</p>
            <p>5. <strong>Vérifier le bon fonctionnement</strong> après nettoyage</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-orange-700 mb-2">
          ⚠️ Action Requise
        </h3>
        <p className="text-muted-foreground">
          Le nettoyage des doublons de composants est nécessaire pour optimiser l'application
        </p>
      </div>
    </div>
  );
}