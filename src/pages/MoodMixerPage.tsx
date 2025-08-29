import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Palette, Sparkles, Eye, Heart, Brain, 
         Zap, Cloud, Sun, Moon, Droplets, Flame, Play, 
         Save, Shuffle, RefreshCw, Settings, Share2 } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface MoodComponent {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface MoodRecipe {
  id: string;
  name: string;
  description: string;
  components: { [key: string]: number };
  category: 'energy' | 'calm' | 'focus' | 'creativity' | 'balance';
  rating: number;
  uses: number;
  favorite: boolean;
  effects: string[];
}

interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  name: string;
}

const MoodMixerPage: React.FC = () => {
  usePageMetadata('Mood Mixer', 'Créez votre état émotionnel idéal', '/app/mood-mixer', 'creative');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mixer');
  const [moodComponents, setMoodComponents] = useState<MoodComponent[]>([]);
  const [currentMix, setCurrentMix] = useState<{ [key: string]: number }>({});
  const [mixName, setMixName] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<MoodRecipe[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);
  const [mixIntensity, setMixIntensity] = useState([75]);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    initializeMoodComponents();
    loadSavedRecipes();
    startMixingSession();
  }, []);

  useEffect(() => {
    updateTheme();
  }, [currentMix]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const initializeMoodComponents = () => {
    const components: MoodComponent[] = [
      {
        id: 'joy',
        name: 'Joie',
        value: 50,
        color: '#F59E0B',
        icon: Sun,
        description: 'Bonheur et optimisme'
      },
      {
        id: 'calm',
        name: 'Calme',
        value: 30,
        color: '#3B82F6',
        icon: Cloud,
        description: 'Sérénité et paix intérieure'
      },
      {
        id: 'energy',
        name: 'Énergie',
        value: 70,
        color: '#EF4444',
        icon: Flame,
        description: 'Vitalité et dynamisme'
      },
      {
        id: 'focus',
        name: 'Focus',
        value: 40,
        color: '#8B5CF6',
        icon: Eye,
        description: 'Concentration et clarté'
      },
      {
        id: 'love',
        name: 'Amour',
        value: 60,
        color: '#EC4899',
        icon: Heart,
        description: 'Bienveillance et connexion'
      },
      {
        id: 'creativity',
        name: 'Créativité',
        value: 80,
        color: '#10B981',
        icon: Sparkles,
        description: 'Innovation et inspiration'
      },
      {
        id: 'wisdom',
        name: 'Sagesse',
        value: 35,
        color: '#6366F1',
        icon: Brain,
        description: 'Réflexion et intuition'
      },
      {
        id: 'flow',
        name: 'Flow',
        value: 55,
        color: '#06B6D4',
        icon: Droplets,
        description: 'État de fluidité optimal'
      }
    ];
    
    setMoodComponents(components);
    
    // Initialiser le mix actuel
    const initialMix: { [key: string]: number } = {};
    components.forEach(comp => {
      initialMix[comp.id] = comp.value;
    });
    setCurrentMix(initialMix);
  };

  const loadSavedRecipes = () => {
    const recipes: MoodRecipe[] = [
      {
        id: '1',
        name: 'Morning Boost',
        description: 'Parfait pour commencer la journée avec énergie',
        components: { joy: 80, energy: 90, focus: 70, calm: 30 },
        category: 'energy',
        rating: 4.8,
        uses: 15,
        favorite: true,
        effects: ['Motivation', 'Clarté mentale', 'Enthousiasme']
      },
      {
        id: '2',
        name: 'Zen Master',
        description: 'Pour une méditation profonde et apaisante',
        components: { calm: 95, wisdom: 80, love: 60, flow: 70 },
        category: 'calm',
        rating: 4.9,
        uses: 23,
        favorite: true,
        effects: ['Paix intérieure', 'Relaxation', 'Équilibre']
      },
      {
        id: '3',
        name: 'Creative Flow',
        description: 'Libérez votre potentiel créatif',
        components: { creativity: 95, flow: 85, joy: 70, energy: 60 },
        category: 'creativity',
        rating: 4.7,
        uses: 12,
        favorite: false,
        effects: ['Innovation', 'Inspiration', 'Expression']
      },
      {
        id: '4',
        name: 'Deep Focus',
        description: 'Concentration maximale pour le travail',
        components: { focus: 90, calm: 60, wisdom: 70, energy: 50 },
        category: 'focus',
        rating: 4.6,
        uses: 18,
        favorite: false,
        effects: ['Concentration', 'Productivité', 'Clarté']
      }
    ];
    setSavedRecipes(recipes);
  };

  const startMixingSession = () => {
    setSessionDuration(0);
    setIsPlaying(true);
  };

  const updateMoodComponent = (componentId: string, value: number) => {
    setCurrentMix(prev => ({
      ...prev,
      [componentId]: value
    }));
  };

  const updateTheme = () => {
    if (Object.keys(currentMix).length === 0) return;

    // Calculer la couleur dominante basée sur le mix
    const dominantComponent = Object.entries(currentMix).reduce((a, b) => 
      currentMix[a[0]] > currentMix[b[0]] ? a : b
    );
    
    const component = moodComponents.find(c => c.id === dominantComponent[0]);
    if (!component) return;

    const theme: ColorTheme = {
      primary: component.color,
      secondary: `${component.color}80`,
      accent: `${component.color}40`,
      background: `${component.color}10`,
      name: component.name
    };
    
    setCurrentTheme(theme);
  };

  const getMixScore = () => {
    const values = Object.values(currentMix);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const harmony = 100 - (Math.max(...values) - Math.min(...values));
    return Math.round((average + harmony) / 2);
  };

  const getMixCategory = (): MoodRecipe['category'] => {
    const highestComponent = Object.entries(currentMix).reduce((a, b) => 
      currentMix[a[0]] > currentMix[b[0]] ? a : b
    );
    
    switch (highestComponent[0]) {
      case 'energy':
      case 'joy': return 'energy';
      case 'calm':
      case 'wisdom': return 'calm';
      case 'focus': return 'focus';
      case 'creativity': return 'creativity';
      default: return 'balance';
    }
  };

  const saveMix = () => {
    if (!mixName.trim()) return;

    const newRecipe: MoodRecipe = {
      id: Date.now().toString(),
      name: mixName,
      description: 'Mix personnalisé créé avec le Mood Mixer',
      components: { ...currentMix },
      category: getMixCategory(),
      rating: 0,
      uses: 0,
      favorite: false,
      effects: getEstimatedEffects()
    };

    setSavedRecipes(prev => [newRecipe, ...prev]);
    setMixName('');
  };

  const loadRecipe = (recipe: MoodRecipe) => {
    setCurrentMix(recipe.components);
    setMixName(recipe.name);
  };

  const randomizeMix = () => {
    const newMix: { [key: string]: number } = {};
    moodComponents.forEach(component => {
      newMix[component.id] = Math.floor(Math.random() * 100);
    });
    setCurrentMix(newMix);
  };

  const resetMix = () => {
    const resetMix: { [key: string]: number } = {};
    moodComponents.forEach(component => {
      resetMix[component.id] = 50;
    });
    setCurrentMix(resetMix);
  };

  const getEstimatedEffects = (): string[] => {
    const effects: string[] = [];
    
    Object.entries(currentMix).forEach(([componentId, value]) => {
      const component = moodComponents.find(c => c.id === componentId);
      if (component && value > 70) {
        effects.push(component.description);
      }
    });
    
    return effects.length > 0 ? effects : ['Équilibre général'];
  };

  const getCategoryColor = (category: MoodRecipe['category']) => {
    switch (category) {
      case 'energy': return 'bg-red-500';
      case 'calm': return 'bg-blue-500';
      case 'focus': return 'bg-purple-500';
      case 'creativity': return 'bg-green-500';
      case 'balance': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      data-testid="page-root" 
      className="min-h-screen p-6 transition-all duration-500"
      style={{
        background: currentTheme ? 
          `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.accent})` :
          'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mood Mixer</h1>
              <p className="text-gray-600">Créez votre cocktail émotionnel parfait</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: currentTheme?.primary || '#6B7280' }}>
                {getMixScore()}
              </div>
              <div className="text-sm text-gray-600">Score du mix</div>
            </div>
            {isPlaying && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Play className="w-4 h-4" style={{ color: currentTheme?.primary }} />
                <span className="font-mono">{formatDuration(sessionDuration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Thème actuel */}
        {currentTheme && (
          <Card className="border-2" style={{ borderColor: currentTheme.primary }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Thème: {currentTheme.name}</h3>
                    <p className="text-sm text-gray-600">
                      Mix en cours • Intensité {mixIntensity[0]}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    variant="outline"
                    style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mixer">Mixer</TabsTrigger>
            <TabsTrigger value="recipes">Recettes</TabsTrigger>
            <TabsTrigger value="effects">Effets</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="mixer" className="space-y-6">
            {/* Contrôles principaux */}
            <div className="flex gap-4 justify-center mb-6">
              <Button onClick={randomizeMix} variant="outline">
                <Shuffle className="w-4 h-4 mr-2" />
                Mélange aléatoire
              </Button>
              <Button onClick={resetMix} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>

            {/* Composants d'humeur */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {moodComponents.map((component) => {
                const IconComponent = component.icon;
                const value = currentMix[component.id] || 50;
                
                return (
                  <Card key={component.id} className="relative overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: component.color }}
                    />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div 
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: component.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {component.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <p className="text-sm text-gray-600">{component.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Intensité</span>
                          <span 
                            className="text-lg font-bold"
                            style={{ color: component.color }}
                          >
                            {value}%
                          </span>
                        </div>
                        
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) => updateMoodComponent(component.id, newValue[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                              width: `${value}%`,
                              backgroundColor: component.color 
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Faible</span>
                        <span>Intense</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Sauvegarde du mix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Sauvegarder ce mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Nom du mix</label>
                    <input
                      type="text"
                      placeholder="Mon mix parfait..."
                      value={mixName}
                      onChange={(e) => setMixName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={saveMix}
                    disabled={!mixName.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sauvegarder
                  </Button>
                </div>
                
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge className={getCategoryColor(getMixCategory())}>
                    {getMixCategory()}
                  </Badge>
                  <Badge variant="outline">Score: {getMixScore()}/100</Badge>
                  {getEstimatedEffects().map((effect, index) => (
                    <Badge key={index} variant="secondary">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recettes sauvegardées</h2>
              <div className="flex gap-2">
                {['Tous', 'energy', 'calm', 'focus', 'creativity', 'balance'].map((filter) => (
                  <Button key={filter} variant="outline" size="sm" className="capitalize">
                    {filter === 'Tous' ? 'Tous' : filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <Card key={recipe.id} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        {recipe.favorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                        {recipe.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(recipe.category)}>
                        {recipe.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span>Note:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${
                              i < Math.floor(recipe.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-1 text-gray-600">({recipe.rating})</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Utilisations:</span>
                        <span className="font-medium">{recipe.uses}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Effets:</div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.effects.map((effect, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Composition:</div>
                      <div className="space-y-1">
                        {Object.entries(recipe.components).map(([componentId, value]) => {
                          const component = moodComponents.find(c => c.id === componentId);
                          if (!component) return null;
                          
                          return (
                            <div key={componentId} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: component.color }}
                              />
                              <span className="text-xs">{component.name}</span>
                              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full"
                                  style={{ 
                                    width: `${value}%`,
                                    backgroundColor: component.color 
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{value}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => loadRecipe(recipe)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Charger
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6">
            {/* Effets actuels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Effets du mix actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Score de bien-être estimé:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={getMixScore()} className="w-24" />
                      <span className="font-bold text-green-600">{getMixScore()}/100</span>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Effets prédits:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getEstimatedEffects().map((effect, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Sparkles className="w-5 h-5 text-yellow-500" />
                          <span>{effect}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">8.5/10</div>
                      <div className="text-sm text-gray-600">Niveau d'énergie</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">9.2/10</div>
                      <div className="text-sm text-gray-600">Équilibre émotionnel</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">7.8/10</div>
                      <div className="text-sm text-gray-600">Potentiel créatif</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils personnalisés */}
            <Card>
              <CardHeader>
                <CardTitle>Conseils personnalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: 'amélioration',
                      title: 'Boostez votre créativité',
                      description: 'Augmentez la composante Créativité à 85% pour libérer votre potentiel artistique',
                      action: 'Ajuster le mix'
                    },
                    {
                      type: 'équilibre',
                      title: 'Équilibrez vos énergies',
                      description: 'Votre mix est très énergique. Ajoutez plus de Calme pour un meilleur équilibre',
                      action: 'Voir les suggestions'
                    },
                    {
                      type: 'optimal',
                      title: 'Mix optimal détecté',
                      description: 'Ce mélange est parfait pour une session de travail créatif',
                      action: 'Sauvegarder'
                    }
                  ].map((conseil, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        conseil.type === 'amélioration' ? 'bg-blue-100' :
                        conseil.type === 'équilibre' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {conseil.type === 'amélioration' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                        {conseil.type === 'équilibre' && <Balance className="w-5 h-5 text-orange-600" />}
                        {conseil.type === 'optimal' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{conseil.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{conseil.description}</p>
                        <Button size="sm" variant="outline">
                          {conseil.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Historique des sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Morning Boost', date: 'Aujourd\'hui 09:30', duration: '25 min', score: 92, effects: ['Énergie', 'Focus'] },
                    { name: 'Creative Flow', date: 'Hier 14:15', duration: '40 min', score: 88, effects: ['Créativité', 'Flow'] },
                    { name: 'Zen Master', date: 'Hier 20:45', duration: '30 min', score: 95, effects: ['Calme', 'Sérénité'] },
                    { name: 'Deep Focus', date: '2 jours', duration: '60 min', score: 85, effects: ['Concentration', 'Productivité'] }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white">
                          <Palette className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-medium">{session.name}</div>
                          <div className="text-sm text-gray-600">{session.date} • {session.duration}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{session.score}/100</div>
                        <div className="text-xs text-gray-500">
                          {session.effects.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Vos statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-gray-600">Sessions totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">18h</div>
                    <div className="text-sm text-gray-600">Temps de mix</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-gray-600">Score moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">Creative Flow</div>
                    <div className="text-sm text-gray-600">Mix favori</div>
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

export default MoodMixerPage;