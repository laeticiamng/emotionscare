
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Camera, Sparkles, Smile, Heart, Zap, Download, Share2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARFiltersPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [intensity, setIntensity] = useState([75]);
  const [isRecording, setIsRecording] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const emotionalFilters = [
    {
      id: 'joy-burst',
      name: 'Joy Burst',
      description: 'Explose de joie avec des particules dorées',
      emotion: 'Joie',
      color: 'text-yellow-500',
      icon: Sparkles,
      preview: '✨🌟💫'
    },
    {
      id: 'calm-aura',
      name: 'Calm Aura',
      description: 'Aura apaisante avec des vagues bleues',
      emotion: 'Calme',
      color: 'text-blue-500',
      icon: Heart,
      preview: '💙🌊☁️'
    },
    {
      id: 'energy-boost',
      name: 'Energy Boost',
      description: 'Éclairs d\'énergie électrisants',
      emotion: 'Énergie',
      color: 'text-red-500',
      icon: Zap,
      preview: '⚡🔥💪'
    },
    {
      id: 'love-glow',
      name: 'Love Glow',
      description: 'Halo romantique avec cœurs flottants',
      emotion: 'Amour',
      color: 'text-pink-500',
      icon: Heart,
      preview: '💕💖💗'
    }
  ];

  const handleFilterSelect = useCallback((filterId: string) => {
    setActiveFilter(filterId === activeFilter ? null : filterId);
  }, [activeFilter]);

  const handleSaveFilter = useCallback(() => {
    if (activeFilter && !savedFilters.includes(activeFilter)) {
      setSavedFilters(prev => [...prev, activeFilter]);
    }
  }, [activeFilter, savedFilters]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            📱 AR Emotion Filters
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Exprime tes émotions avec des filtres AR immersifs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Zone caméra/preview */}
          <div className="space-y-6">
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Aperçu Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {/* Simulation zone caméra */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">📹</div>
                  </div>
                  
                  {/* Overlay du filtre actif */}
                  <AnimatePresence>
                    {activeFilter && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: intensity[0] / 100 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center text-4xl"
                        data-testid="filter-overlay"
                      >
                        {emotionalFilters.find(f => f.id === activeFilter)?.preview}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Indicateur d'enregistrement */}
                  {isRecording && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        REC
                      </div>
                    </div>
                  )}
                </div>

                {/* Contrôles intensité */}
                {activeFilter && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">
                        Intensité: {intensity[0]}%
                      </label>
                      <Slider
                        value={intensity}
                        onValueChange={setIntensity}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="intensity-slider"
                      />
                    </div>
                  </div>
                )}

                {/* Boutons action */}
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    data-testid="record-button"
                  >
                    {isRecording ? 'Arrêter' : 'Enregistrer'}
                  </Button>
                  <Button variant="outline" onClick={handleSaveFilter} disabled={!activeFilter}>
                    <Download className="w-4 h-4 mr-2" />
                    Sauver
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="outline" onClick={() => setActiveFilter(null)}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau filtres */}
          <div className="space-y-6">
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filters">🎭 Filtres</TabsTrigger>
                <TabsTrigger value="saved">💾 Sauvegardés</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="space-y-4">
                {emotionalFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  const isActive = activeFilter === filter.id;
                  
                  return (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-purple-500/30 border-purple-400' 
                            : 'bg-black/30 border-gray-600 hover:border-purple-500/50'
                        }`}
                        onClick={() => handleFilterSelect(filter.id)}
                        data-testid={`filter-${filter.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center`}>
                              <IconComponent className={`w-6 h-6 ${filter.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-white">{filter.name}</h3>
                              <p className="text-sm text-gray-300 mb-2">{filter.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {filter.emotion}
                                </Badge>
                                <span className="text-2xl">{filter.preview}</span>
                              </div>
                            </div>
                            {isActive && (
                              <div className="text-purple-400">
                                <Sparkles className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                {savedFilters.length === 0 ? (
                  <Card className="bg-black/30 border-gray-600">
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">📁</div>
                      <h3 className="text-white font-bold mb-2">Aucun filtre sauvegardé</h3>
                      <p className="text-gray-400">Sauvegarde tes filtres préférés pour les retrouver facilement</p>
                    </CardContent>
                  </Card>
                ) : (
                  savedFilters.map((filterId) => {
                    const filter = emotionalFilters.find(f => f.id === filterId);
                    if (!filter) return null;
                    
                    return (
                      <Card key={filterId} className="bg-black/30 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{filter.preview}</span>
                              <div>
                                <h4 className="font-bold text-white">{filter.name}</h4>
                                <p className="text-sm text-gray-400">{filter.emotion}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setActiveFilter(filterId)}
                              variant={activeFilter === filterId ? "default" : "outline"}
                            >
                              {activeFilter === filterId ? "Actif" : "Utiliser"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Section stats/conseils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400">💡 Conseils d'utilisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-white">Bonne lumière</h4>
                  <p className="text-sm text-gray-400">Assure-toi d'avoir un bon éclairage</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="font-bold text-white">Tiens stable</h4>
                  <p className="text-sm text-gray-400">Garde ton téléphone stable pour de meilleurs résultats</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">😊</div>
                  <h4 className="font-bold text-white">Exprime-toi</h4>
                  <p className="text-sm text-gray-400">Les filtres réagissent à tes expressions</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-bold text-white">Personnalise</h4>
                  <p className="text-sm text-gray-400">Ajuste l'intensité selon ton humeur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ARFiltersPage;
