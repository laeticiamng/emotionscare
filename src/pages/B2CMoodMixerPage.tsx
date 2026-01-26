// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useMoodMixerEnriched, type MoodPreset } from '@/modules/mood-mixer/useMoodMixerEnriched';
import { 
  Palette, Heart, Zap, Smile, CloudRain, Sun, Moon, Sparkles, 
  Play, Pause, RotateCcw, Save, Star, Clock, TrendingUp, 
  History, BarChart3, ThumbsUp, ThumbsDown, Minus, Award
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, CloudRain, Sun, Sparkles, Heart, Moon
};

const B2CMoodMixerPage: React.FC = () => {
  const { user } = useAuth();
  const {
    moodComponents,
    updateComponent,
    resetComponents,
    presets,
    applyPreset,
    saveAsPreset,
    toggleFavorite,
    deletePreset,
    isSessionActive,
    sessionDuration,
    startSession,
    endSession,
    isPlaying,
    togglePlayback,
    stats,
    history,
    isLoadingStats,
    isLoadingHistory,
    getMoodDescription,
    getMoodScore,
  } = useMoodMixerEnriched(user?.id);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSavePreset = () => {
    if (presetName.trim()) {
      saveAsPreset(presetName, presetDescription);
      setPresetName('');
      setPresetDescription('');
      setShowSaveDialog(false);
    }
  };

  const handleEndSession = (satisfaction: 'positive' | 'neutral' | 'negative') => {
    const satisfactionScore = satisfaction === 'positive' ? 5 : satisfaction === 'neutral' ? 3 : 1;
    endSession(satisfactionScore);
    setShowEndDialog(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPresets = selectedCategory 
    ? presets.filter(p => p.category === selectedCategory)
    : presets;

  const favoritePresets = filteredPresets.filter(p => p.isFavorite);
  const otherPresets = filteredPresets.filter(p => !p.isFavorite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-muted/20 p-4 md:p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mood Mixer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Créez votre recette émotionnelle parfaite en mélangeant différents états d'esprit.
          </p>
        </motion.div>

        <Tabs defaultValue="mixer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
            <TabsTrigger value="mixer" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Mixer</span>
            </TabsTrigger>
            <TabsTrigger value="presets" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Presets</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Mixer Tab */}
          <TabsContent value="mixer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Smile className="w-5 h-5" />
                          Votre Mix Actuel
                        </CardTitle>
                        <CardDescription>
                          {getMoodDescription()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isPlaying ? "default" : "outline"}
                          onClick={togglePlayback}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                          {isPlaying ? "Pause" : "Écouter"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={resetComponents}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(true)}>
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Visualisation globale */}
                    <div className="relative h-24 bg-muted rounded-xl overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {moodComponents.map((comp, index) => (
                          <motion.div
                            key={comp.id}
                            className={`bg-gradient-to-t ${comp.color}`}
                            style={{ 
                              width: `${100 / moodComponents.length}%`,
                              opacity: comp.value / 100 
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${comp.value}%` }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                          />
                        ))}
                      </div>
                      
                      {isPlaying && (
                        <motion.div
                          className="absolute top-0 left-0 w-1 h-full bg-white/80"
                          animate={{ left: ["0%", "100%"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      
                      {/* Score badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-background/80 text-foreground">
                          Score: {getMoodScore()}%
                        </Badge>
                      </div>
                    </div>

                    {/* Curseurs de composants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {moodComponents.map((component, index) => {
                        const Icon = ICON_MAP[component.icon] || Sparkles;
                        return (
                          <motion.div
                            key={component.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${component.color}`} />
                              <Icon className="w-4 h-4" />
                              <span className="font-medium">{component.name}</span>
                              <Badge variant="outline" className="ml-auto">
                                {component.value}%
                              </Badge>
                            </div>
                            
                            <Slider
                              value={[component.value]}
                              onValueChange={(values) => updateComponent(component.id, values[0])}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            
                            <p className="text-xs text-muted-foreground">
                              {component.description}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Session Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contrôle de Session</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <p className="font-medium">
                          {isSessionActive ? (
                            <span className="text-green-500 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              Session active
                            </span>
                          ) : (
                            <span className="text-muted-foreground">En attente</span>
                          )}
                        </p>
                      </div>
                      {isSessionActive && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Durée</p>
                          <p className="font-mono text-lg font-bold text-primary">
                            {formatDuration(sessionDuration)}
                          </p>
                        </div>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {isSessionActive ? (
                        <motion.div
                          key="end"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Button
                            onClick={() => setShowEndDialog(true)}
                            variant="destructive"
                            className="w-full gap-2"
                            size="lg"
                          >
                            Terminer la session
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Button
                            onClick={startSession}
                            className="w-full gap-2"
                            size="lg"
                          >
                            <Play className="w-5 h-5" />
                            Démarrer une session
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Quick Presets */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Presets Rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.filter(p => p.isFavorite).slice(0, 4).map(preset => (
                        <Button
                          key={preset.id}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto py-2"
                          onClick={() => applyPreset(preset)}
                        >
                          <div>
                            <p className="font-medium text-xs">{preset.name}</p>
                          </div>
                        </Button>
                      ))}
                      {presets.filter(p => p.isFavorite).length === 0 && (
                        <p className="col-span-2 text-xs text-muted-foreground text-center py-4">
                          Marquez des presets en favoris pour y accéder rapidement
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Bibliothèque de Presets
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowSaveDialog(true)}>
                    <Save className="h-4 w-4 mr-1" />
                    Nouveau
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category filters */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Tous
                  </Button>
                  {['relax', 'energy', 'focus', 'sleep', 'creative', 'custom'].map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat === 'relax' ? 'Relaxation' : 
                       cat === 'energy' ? 'Énergie' : 
                       cat === 'focus' ? 'Concentration' :
                       cat === 'sleep' ? 'Sommeil' :
                       cat === 'creative' ? 'Créativité' : 'Personnalisé'}
                    </Button>
                  ))}
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {/* Favorites */}
                    {favoritePresets.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          Favoris
                        </h4>
                        <div className="grid gap-3">
                          {favoritePresets.map((preset, index) => (
                            <PresetCard 
                              key={preset.id} 
                              preset={preset} 
                              index={index}
                              onApply={applyPreset}
                              onToggleFavorite={toggleFavorite}
                              onDelete={deletePreset}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other presets */}
                    {otherPresets.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          {favoritePresets.length > 0 ? 'Autres presets' : 'Tous les presets'}
                        </h4>
                        <div className="grid gap-3">
                          {otherPresets.map((preset, index) => (
                            <PresetCard 
                              key={preset.id} 
                              preset={preset} 
                              index={index}
                              onApply={applyPreset}
                              onToggleFavorite={toggleFavorite}
                              onDelete={deletePreset}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historique des sessions
                  </CardTitle>
                  {history.length > 0 && (
                    <Badge variant="secondary">{history.length} sessions</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune session enregistrée</p>
                    <p className="text-sm">Démarrez votre première session pour commencer</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {history.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {session.mood_before || 'Session de mix'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {Math.round(session.duration_seconds / 60)} min
                                </span>
                                <span>
                                  {new Date(session.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                            {session.satisfaction_score && (
                              <Badge variant={session.satisfaction_score >= 4 ? 'default' : 'secondary'}>
                                {session.satisfaction_score >= 4 ? '😊' : session.satisfaction_score >= 3 ? '😐' : '😕'} 
                                {' '}{session.satisfaction_score}/5
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            {isLoadingStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="h-20 bg-muted/50 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !stats ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Pas encore de statistiques</p>
                    <p className="text-sm">Complétez des sessions pour voir vos stats</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <History className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Sessions</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Satisfaction</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.averageSatisfaction.toFixed(1)}/5</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Niveau</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.masteryLevel}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Achievements</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.unlockedAchievements?.length || 0}</p>
                    </CardContent>
                  </Card>
                </div>

                {stats.favoriteEmotions && stats.favoriteEmotions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Émotions préférées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {stats.favoriteEmotions.map(emotion => (
                          <Badge key={emotion} variant="secondary" className="text-sm">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Preset Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarder ce mix</DialogTitle>
            <DialogDescription>
              Créez un preset personnalisé à partir de votre mix actuel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nom du preset</label>
              <Input 
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Mon mix parfait"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="Décrivez ce mix..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Annuler</Button>
            <Button onClick={handleSavePreset} disabled={!presetName.trim()}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment vous sentez-vous ?</DialogTitle>
            <DialogDescription>
              Votre feedback nous aide à personnaliser votre expérience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => handleEndSession('negative')}
              className="flex-col gap-2 h-auto py-6 hover:bg-red-50 hover:border-red-200"
            >
              <ThumbsDown className="w-8 h-8 text-red-500" />
              <span>Pas génial</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleEndSession('neutral')}
              className="flex-col gap-2 h-auto py-6 hover:bg-gray-50"
            >
              <Minus className="w-8 h-8 text-gray-500" />
              <span>Neutre</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleEndSession('positive')}
              className="flex-col gap-2 h-auto py-6 hover:bg-green-50 hover:border-green-200"
            >
              <ThumbsUp className="w-8 h-8 text-green-500" />
              <span>Super !</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Preset Card Component
interface PresetCardProps {
  preset: MoodPreset;
  index: number;
  onApply: (preset: MoodPreset) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, index, onApply, onToggleFavorite, onDelete }) => {
  const categoryColors: Record<string, string> = {
    relax: 'from-blue-400 to-cyan-500',
    energy: 'from-orange-400 to-red-500',
    focus: 'from-purple-400 to-indigo-500',
    sleep: 'from-indigo-400 to-violet-500',
    creative: 'from-pink-400 to-rose-500',
    custom: 'from-emerald-400 to-teal-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group"
      onClick={() => onApply(preset)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[preset.category]} flex items-center justify-center text-white`}>
          <Sparkles className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{preset.name}</span>
            {preset.isBuiltIn && (
              <Badge variant="secondary" className="text-xs">Intégré</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {preset.description}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(preset.id);
            }}
          >
            <Star className={`h-4 w-4 ${preset.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onApply(preset);
            }}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default B2CMoodMixerPage;
