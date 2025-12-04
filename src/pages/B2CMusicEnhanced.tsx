/**
 * B2C Music Enhanced Page - Page principale de thérapie musicale
 * Route: /app/music
 */

import React, { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Music, 
  Sparkles, 
  BarChart3, 
  Settings, 
  HeadphonesIcon,
  Brain,
  Heart,
  Palette
} from 'lucide-react';
import { PageErrorBoundary } from '@/components/error/PageErrorBoundary';
import { LoadingState } from '@/components/loading/LoadingState';
import { usePageSEO } from '@/hooks/usePageSEO';
import { MoodPresetPicker, type MoodPreset } from '@/components/music/MoodPresetPicker';

// Lazy load heavy components
const PremiumMusicPlayer = React.lazy(() => import('@/components/music/player/PremiumMusicPlayer'));
const MusicTherapyDashboard = React.lazy(() => import('@/components/music/MusicTherapyDashboard'));
const EmotionMusicIntegration = React.lazy(() => import('@/components/music/EmotionMusicIntegration'));

const B2CMusicEnhanced: React.FC = () => {
  usePageSEO({
    title: 'Thérapie Musicale | EmotionsCare',
    description: 'Découvrez la thérapie musicale adaptée à vos émotions. Sons binauraux, playlists personnalisées et analytics.',
  });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('player');
  const [selectedMood, setSelectedMood] = useState<MoodPreset>('calme');

  return (
    <PageErrorBoundary route="/app/music" feature="music-therapy">
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2.5">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Thérapie Musicale</h1>
                  <p className="text-sm text-muted-foreground">
                    Musique adaptée à vos émotions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/music/analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/music/profile')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="player" className="gap-2">
                <HeadphonesIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Lecteur</span>
              </TabsTrigger>
              <TabsTrigger value="therapy" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Thérapie</span>
              </TabsTrigger>
              <TabsTrigger value="mood" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Humeur</span>
              </TabsTrigger>
              <TabsTrigger value="discover" className="gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Découvrir</span>
              </TabsTrigger>
            </TabsList>

            {/* Player Tab */}
            <TabsContent value="player" className="space-y-6">
              <Suspense fallback={<LoadingState variant="section" text="Chargement du lecteur..." />}>
                <PremiumMusicPlayer />
              </Suspense>
            </TabsContent>

            {/* Therapy Tab */}
            <TabsContent value="therapy" className="space-y-6">
              <Suspense fallback={<LoadingState variant="section" text="Chargement..." />}>
                <MusicTherapyDashboard />
              </Suspense>
            </TabsContent>

            {/* Mood Tab */}
            <TabsContent value="mood" className="space-y-6">
              <Suspense fallback={<LoadingState variant="section" text="Chargement..." />}>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Sélectionnez votre humeur
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MoodPresetPicker value={selectedMood} onChange={setSelectedMood} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Musique émotionnelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EmotionMusicIntegration autoStart={false} />
                    </CardContent>
                  </Card>
                </div>
              </Suspense>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/app/music-premium')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Musique Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Accédez à des fonctionnalités avancées de thérapie musicale et contenus exclusifs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/app/music/analytics')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Vos Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualisez vos statistiques d'écoute et découvrez vos tendances musicales.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/app/music/profile')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-500" />
                      Profil Musical
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Personnalisez vos préférences et gérez votre profil musical.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tips Section */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Bienfaits de la musicothérapie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Réduction du stress et de l'anxiété
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Amélioration de la qualité du sommeil
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Régulation émotionnelle naturelle
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Augmentation de la concentration
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default B2CMusicEnhanced;
