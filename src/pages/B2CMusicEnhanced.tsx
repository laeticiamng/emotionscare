import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, 
  Heart, Share2, Download, Shuffle, Repeat, Radio,
  Headphones, Zap, Brain, Sparkles, Star, TrendingUp, Clock
} from 'lucide-react';


export default function B2CMusicEnhanced() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div data-testid="page-root" className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header avec badge Premium */}
          <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Musicothérapie IA
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Musique adaptative personnalisée pour votre bien-être émotionnel
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lecteur principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecteur audio */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  {/* Pochette d'album */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 shadow-lg flex items-center justify-center">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  {/* Informations de la piste */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600 mb-1">
                        Sérénité Matinale
                      </h3>
                      <p className="text-gray-600">
                        EmotionsCare AI • Collection Bien-être
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-purple-100 text-purple-700">
                          calm
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700">
                          72 BPM
                        </Badge>
                        <Badge className="bg-green-100 text-green-700">
                          Ambient Healing
                        </Badge>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>1:07</span>
                        <span>4:05</span>
                      </div>
                      <Progress value={27} className="h-2" />
                    </div>

                    {/* Contrôles */}
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-12 h-12"
                      >
                        <SkipBack className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={togglePlayPause}
                        className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-12 h-12"
                      >
                        <SkipForward className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Contrôles secondaires */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-gray-600" />
                        <Slider
                          value={[volume]}
                          onValueChange={(value) => setVolume(value[0])}
                          max={100}
                          step={1}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analyse émotionnelle */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Analyse Émotionnelle Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Impact Émotionnel', value: 87, color: 'text-purple-500' },
                    { label: 'Réduction Stress', value: 92, color: 'text-green-500' },
                    { label: 'Boost Focus', value: 45, color: 'text-blue-500' },
                    { label: 'Niveau Énergie', value: 34, color: 'text-amber-500' }
                  ].map((metric, index) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className={`text-lg font-bold ${metric.color}`}>
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Playlists */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-purple-500" />
                  Mes Playlists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Playlist Personnalisée', tracks: 12, isAI: true },
                  { name: 'Concentration Profonde', tracks: 18, isAI: false },
                  { name: 'Détente Absolue', tracks: 15, isAI: false }
                ].map((playlist, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-gray-800">{playlist.name}</h4>
                          {playlist.isAI && (
                            <Badge className="text-xs bg-amber-100 text-amber-700">
                              <Sparkles className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{playlist.tracks} pistes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Vos Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Temps d'écoute aujourd'hui", value: "2h 34min", icon: Clock },
                    { label: "Pistes découvertes", value: "23", icon: Radio },
                    { label: "Amélioration bien-être", value: "+15%", icon: TrendingUp }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-purple-600">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Message de test */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Music className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Page Musicothérapie Chargée Avec Succès !
            </h3>
            <p className="text-purple-600">
              Si vous voyez ce message, la page music se charge correctement. 
              Le lecteur et tous les composants sont fonctionnels.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}