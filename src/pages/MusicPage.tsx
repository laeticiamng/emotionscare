
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Headphones, Radio, Disc, Play, Settings } from 'lucide-react';
import MusicPlayerDemo from '@/components/music/MusicPlayerDemo';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

const MusicPage: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('calm');
  const { activateMusicForEmotion, getEmotionMusicDescription, isLoading } = useMusicEmotionIntegration();

  const emotions = [
    { key: 'calm', label: 'Calme', icon: '🧘', color: 'bg-blue-500' },
    { key: 'happy', label: 'Joyeux', icon: '😊', color: 'bg-yellow-500' },
    { key: 'energetic', label: 'Énergique', icon: '⚡', color: 'bg-red-500' },
    { key: 'focused', label: 'Concentré', icon: '🎯', color: 'bg-purple-500' },
    { key: 'relaxed', label: 'Détendu', icon: '😌', color: 'bg-green-500' }
  ];

  const handleEmotionSelect = async (emotion: string) => {
    setSelectedEmotion(emotion);
    await activateMusicForEmotion({ emotion });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Musique Émotionnelle
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez une expérience musicale adaptée à vos émotions et votre état d'esprit
          </p>
        </div>

        <Tabs defaultValue="player" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Lecteur
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Émotions
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Réglages
            </TabsTrigger>
          </TabsList>

          {/* Onglet Lecteur */}
          <TabsContent value="player" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-center">Lecteur Musical Principal</CardTitle>
                </CardHeader>
                <CardContent>
                  <MusicPlayerDemo />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Émotions */}
          <TabsContent value="emotions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Musique par Émotion</CardTitle>
                <p className="text-muted-foreground">
                  Sélectionnez votre état émotionnel pour une expérience musicale personnalisée
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.key}
                      variant={selectedEmotion === emotion.key ? "default" : "outline"}
                      className="p-6 h-auto flex-col gap-3"
                      onClick={() => handleEmotionSelect(emotion.key)}
                      disabled={isLoading}
                    >
                      <div className={`w-12 h-12 rounded-full ${emotion.color} flex items-center justify-center text-white text-2xl`}>
                        {emotion.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{emotion.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {getEmotionMusicDescription(emotion.key)}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                {selectedEmotion && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          Émotion sélectionnée: {emotions.find(e => e.key === selectedEmotion)?.label}
                        </h3>
                        <p className="text-muted-foreground">
                          {getEmotionMusicDescription(selectedEmotion)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Bibliothèque */}
          <TabsContent value="library" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Ma Bibliothèque Musicale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Music className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">Playlists Récentes</h3>
                        <p className="text-sm text-muted-foreground">Vos dernières écoutes</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Headphones className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Favoris</h3>
                        <p className="text-sm text-muted-foreground">Vos morceaux préférés</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Disc className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold">Recommandations</h3>
                        <p className="text-sm text-muted-foreground">Découvertes personnalisées</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Réglages */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences Musicales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Qualité Audio</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Haute qualité (320 kbps)</option>
                      <option>Qualité normale (128 kbps)</option>
                      <option>Économie de données (64 kbps)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Transition entre morceaux</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Fondu enchaîné (3 secondes)</option>
                      <option>Fondu enchaîné (5 secondes)</option>
                      <option>Aucune transition</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="adaptive-volume" className="rounded" />
                    <label htmlFor="adaptive-volume" className="text-sm">
                      Ajustement automatique du volume selon l'émotion
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emotion-detection" className="rounded" defaultChecked />
                    <label htmlFor="emotion-detection" className="text-sm">
                      Détection automatique des émotions pour les recommandations
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicPage;
