import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BookOpen, Wand2, Sparkles, Download, Share2, Play, Pause, 
         Volume2, ArrowLeft, RefreshCw, Save, Eye, Lightbulb, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface StoryElement {
  id: string;
  type: 'character' | 'setting' | 'conflict' | 'emotion' | 'object';
  name: string;
  description: string;
  traits: string[];
  color: string;
}

interface GeneratedStory {
  id: string;
  title: string;
  content: string;
  genre: string;
  mood: string;
  length: number;
  elements: StoryElement[];
  createdAt: Date;
  audioDuration?: number;
}

interface StorySettings {
  genre: string;
  mood: string;
  length: 'short' | 'medium' | 'long';
  target: 'inspiration' | 'relaxation' | 'motivation' | 'reflection';
  personalElements: string[];
}

const B2CStorySynthLabPage: React.FC = () => {
  const navigate = useNavigate();
  usePageMetadata('Story Synth Lab', 'Laboratoire de création d\'histoires personnalisées', '/b2c/story-synth-lab', 'engaged');

  const [currentTab, setCurrentTab] = useState<'create' | 'library' | 'elements'>('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [storySettings, setStorySettings] = useState<StorySettings>({
    genre: 'fantastique',
    mood: 'inspirant',
    length: 'medium',
    target: 'inspiration',
    personalElements: []
  });

  const [customElements, setCustomElements] = useState<StoryElement[]>([
    {
      id: '1',
      type: 'character',
      name: 'Héros Intérieur',
      description: 'La part courageuse qui sommeille en vous',
      traits: ['brave', 'déterminé', 'sage'],
      color: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'setting',
      name: 'Jardin Secret',
      description: 'Un lieu de paix où tout est possible',
      traits: ['paisible', 'magique', 'protecteur'],
      color: 'bg-green-500'
    },
    {
      id: '3',
      type: 'emotion',
      name: 'Confiance Rayonnante',
      description: 'Une énergie positive qui transforme tout',
      traits: ['lumineux', 'chaleureux', 'transformateur'],
      color: 'bg-yellow-500'
    }
  ]);

  const [savedStories, setSavedStories] = useState<GeneratedStory[]>([
    {
      id: '1',
      title: 'Le Voyage de la Transformation',
      content: 'Il était une fois une personne comme vous, qui découvrit qu\'au cœur de chaque défi se cachait une graine de croissance...',
      genre: 'développement personnel',
      mood: 'inspirant',
      length: 856,
      elements: [],
      createdAt: new Date(Date.now() - 86400000),
      audioDuration: 180
    },
    {
      id: '2',
      title: 'L\'Île de la Sérénité',
      content: 'Dans un océan agité de pensées, il existe une île où le calme règne en maître...',
      genre: 'méditation',
      mood: 'apaisant',
      length: 654,
      elements: [],
      createdAt: new Date(Date.now() - 172800000),
      audioDuration: 140
    }
  ]);

  const [newElement, setNewElement] = useState({
    type: 'character' as const,
    name: '',
    description: '',
    traits: [] as string[]
  });

  const genres = [
    { value: 'fantastique', label: 'Fantastique', icon: '🧙‍♀️' },
    { value: 'aventure', label: 'Aventure', icon: '🗺️' },
    { value: 'méditation', label: 'Méditation', icon: '🧘‍♀️' },
    { value: 'développement', label: 'Développement Personnel', icon: '🌱' },
    { value: 'mystère', label: 'Mystère', icon: '🔍' },
    { value: 'science-fiction', label: 'Science-Fiction', icon: '🚀' }
  ];

  const moods = [
    { value: 'inspirant', label: 'Inspirant', color: 'bg-blue-500' },
    { value: 'apaisant', label: 'Apaisant', color: 'bg-green-500' },
    { value: 'motivant', label: 'Motivant', color: 'bg-orange-500' },
    { value: 'réflexif', label: 'Réflexif', color: 'bg-purple-500' },
    { value: 'joyeux', label: 'Joyeux', color: 'bg-yellow-500' }
  ];

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Simulation de génération d'histoire IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newStory: GeneratedStory = {
      id: Date.now().toString(),
      title: 'Votre Histoire Personnalisée',
      content: `Dans un monde où ${storySettings.mood === 'inspirant' ? 'l\'espoir illumine chaque chemin' : 'la tranquillité guide chaque pas'}, une personne extraordinaire - vous - découvre que ${storySettings.target === 'inspiration' ? 'chaque obstacle cache une leçon précieuse' : 'la paix intérieure est la plus grande des forces'}. 

Cette histoire, tissée spécialement pour vous, révèle comment vos propres qualités peuvent transformer n'importe quelle situation. Chaque mot résonne avec votre expérience unique, chaque phrase vous rappelle votre potentiel infini.

${storySettings.genre === 'fantastique' ? 'Dans ce royaume magique de possibilités' : 'Dans cette réalité emplie de merveilles'}, vous découvrez que vous êtes le héros de votre propre aventure, capable de créer la vie que vous désirez vraiment.

L'histoire continue de se déployer, révélant des vérités profondes sur votre courage, votre sagesse et votre capacité unique à grandir et à inspirer les autres autour de vous.`,
      genre: storySettings.genre,
      mood: storySettings.mood,
      length: 482,
      elements: customElements.slice(0, 3),
      createdAt: new Date(),
      audioDuration: 120
    };
    
    setCurrentStory(newStory);
    setSavedStories(prev => [newStory, ...prev]);
    setIsGenerating(false);
  };

  const addElement = () => {
    if (newElement.name && newElement.description) {
      const element: StoryElement = {
        id: Date.now().toString(),
        type: newElement.type,
        name: newElement.name,
        description: newElement.description,
        traits: newElement.traits,
        color: `bg-${['blue', 'green', 'purple', 'orange', 'pink'][Math.floor(Math.random() * 5)]}-500`
      };
      
      setCustomElements(prev => [...prev, element]);
      setNewElement({ type: 'character', name: '', description: '', traits: [] });
    }
  };

  const playStoryAudio = (story: GeneratedStory) => {
    setIsPlaying(!isPlaying);
    // Ici on intégrerait la synthèse vocale
    if (!isPlaying) {
      // Simulation de lecture audio
      setTimeout(() => setIsPlaying(false), story.audioDuration ? story.audioDuration * 1000 : 120000);
    }
  };

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/app/home')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au Dashboard
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📖 Story Synth Lab
          </h1>
          <p className="text-muted-foreground">Créez des histoires qui vous inspirent</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <span className="font-semibold">Laboratoire Créatif</span>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Créer
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Bibliothèque
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Éléments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panneau de configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Configuration de l'Histoire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={storySettings.genre} onValueChange={(value) => 
                    setStorySettings(prev => ({ ...prev, genre: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map(genre => (
                        <SelectItem key={genre.value} value={genre.value}>
                          {genre.icon} {genre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Ambiance</label>
                  <div className="grid grid-cols-2 gap-2">
                    {moods.map(mood => (
                      <Button
                        key={mood.value}
                        variant={storySettings.mood === mood.value ? 'default' : 'outline'}
                        onClick={() => setStorySettings(prev => ({ ...prev, mood: mood.value }))}
                        className="h-12"
                      >
                        <div className={`w-3 h-3 rounded-full ${mood.color} mr-2`} />
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Longueur</label>
                  <Select value={storySettings.length} onValueChange={(value) => 
                    setStorySettings(prev => ({ ...prev, length: value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">🔸 Courte (2-3 min)</SelectItem>
                      <SelectItem value="medium">🔹 Moyenne (5-7 min)</SelectItem>
                      <SelectItem value="long">🔶 Longue (10-15 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Objectif</label>
                  <Select value={storySettings.target} onValueChange={(value) => 
                    setStorySettings(prev => ({ ...prev, target: value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspiration">✨ Inspiration</SelectItem>
                      <SelectItem value="relaxation">😌 Relaxation</SelectItem>
                      <SelectItem value="motivation">🚀 Motivation</SelectItem>
                      <SelectItem value="reflection">🤔 Réflexion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={generateStory}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Générer l'Histoire
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prévisualisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Prévisualisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStory ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{currentStory.title}</h3>
                      <div className="flex gap-2 mb-4">
                        <Badge>{currentStory.genre}</Badge>
                        <Badge variant="outline">{currentStory.mood}</Badge>
                        <Badge variant="secondary">{currentStory.length} mots</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg max-h-60 overflow-y-auto">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {currentStory.content}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => playStoryAudio(currentStory)}
                        className="flex-1"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Écouter
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Configurez vos préférences et générez votre première histoire personnalisée
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{story.genre}</Badge>
                      <Badge className={moods.find(m => m.value === story.mood)?.color}>
                        {story.mood}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {story.content}
                    </p>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{story.length} mots</span>
                      <span>{story.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentStory(story)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => playStoryAudio(story)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="elements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ajout d'élément */}
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Élément</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={newElement.type} 
                  onValueChange={(value) => setNewElement(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="character">👤 Personnage</SelectItem>
                    <SelectItem value="setting">🏞️ Lieu</SelectItem>
                    <SelectItem value="emotion">💫 Émotion</SelectItem>
                    <SelectItem value="object">📦 Objet</SelectItem>
                    <SelectItem value="conflict">⚡ Conflit</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Nom de l'élément"
                  value={newElement.name}
                  onChange={(e) => setNewElement(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <Textarea
                  placeholder="Description détaillée"
                  value={newElement.description}
                  onChange={(e) => setNewElement(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
                
                <Button onClick={addElement} className="w-full">
                  Ajouter l'Élément
                </Button>
              </CardContent>
            </Card>

            {/* Éléments existants */}
            <Card>
              <CardHeader>
                <CardTitle>Vos Éléments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {customElements.map((element) => (
                    <div key={element.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${element.color}`} />
                        <span className="font-semibold">{element.name}</span>
                        <Badge variant="outline">{element.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {element.description}
                      </p>
                      {element.traits.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {element.traits.map((trait, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CStorySynthLabPage;