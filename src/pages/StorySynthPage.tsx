import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Wand2, Star, Play, Pause, 
         SkipForward, RotateCcw, Save, Share2, Heart, 
         Eye, Brain, Sparkles, Users, Clock, Volume2 } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Story {
  id: string;
  title: string;
  description: string;
  genre: 'adventure' | 'mystery' | 'romance' | 'fantasy' | 'sci-fi' | 'personal-growth' | 'motivation';
  chapters: Chapter[];
  protagonist: Character;
  mood: string;
  themes: string[];
  readingTime: number;
  created: string;
  progress: number;
  rating: number;
  favorite: boolean;
  personalizations: Personalization[];
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  choices?: Choice[];
  mood: string;
  readingTime: number;
  completed: boolean;
}

interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextChapter: string;
  impact: 'positive' | 'neutral' | 'negative';
}

interface Character {
  name: string;
  traits: string[];
  background: string;
  goals: string[];
  avatar: string;
}

interface Personalization {
  type: 'character' | 'setting' | 'theme' | 'style';
  value: string;
  description: string;
}

interface StoryTemplate {
  id: string;
  title: string;
  description: string;
  genre: Story['genre'];
  estimatedChapters: number;
  personalizable: boolean;
  icon: string;
  difficulty: 'simple' | 'medium' | 'complex';
}

const StorySynthPage: React.FC = () => {
  usePageMetadata('Story Synth', 'Créez des histoires personnalisées et interactives', '/app/story-synth', 'creative');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [stories, setStories] = useState<Story[]>([]);
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(200); // mots par minute
  const [storyPrompt, setStoryPrompt] = useState('');
  const [personalizations, setPersonalizations] = useState<Personalization[]>([]);

  useEffect(() => {
    loadStories();
    loadTemplates();
  }, []);

  const loadStories = () => {
    const mockStories: Story[] = [
      {
        id: '1',
        title: 'Le Voyage Intérieur de Sophie',
        description: 'Une histoire de développement personnel où Sophie découvre sa force intérieure',
        genre: 'personal-growth',
        chapters: [
          {
            id: '1',
            title: 'Un Nouveau Départ',
            content: 'Sophie se regardait dans le miroir ce matin-là, réalisant que quelque chose devait changer. Elle avait toujours rêvé de plus, mais la peur l\'avait retenue. Aujourd\'hui serait différent...',
            choices: [
              {
                id: '1',
                text: 'Prendre une décision audacieuse',
                consequence: 'Sophie décide de postuler pour le poste de ses rêves',
                nextChapter: '2',
                impact: 'positive'
              },
              {
                id: '2',
                text: 'Réfléchir davantage',
                consequence: 'Sophie prend le temps d\'analyser ses options',
                nextChapter: '2b',
                impact: 'neutral'
              }
            ],
            mood: 'introspective',
            readingTime: 3,
            completed: true
          },
          {
            id: '2',
            title: 'Le Premier Pas',
            content: 'Avec détermination, Sophie prépara sa candidature. Chaque mot qu\'elle écrivait la rapprochait de son rêve. Elle sentait une énergie nouvelle circuler en elle...',
            mood: 'motivated',
            readingTime: 4,
            completed: false
          }
        ],
        protagonist: {
          name: 'Sophie',
          traits: ['courageuse', 'réfléchie', 'ambitieuse'],
          background: 'Jeune professionnelle en quête de sens',
          goals: ['Trouver un travail épanouissant', 'Gagner en confiance', 'Réaliser ses rêves'],
          avatar: '👩‍💼'
        },
        mood: 'inspirant',
        themes: ['courage', 'transformation', 'réalisation de soi'],
        readingTime: 25,
        created: new Date().toISOString(),
        progress: 50,
        rating: 4.8,
        favorite: true,
        personalizations: [
          { type: 'character', value: 'Sophie', description: 'Protagoniste féminine ambitieuse' },
          { type: 'theme', value: 'développement personnel', description: 'Focus sur la croissance personnelle' }
        ]
      },
      {
        id: '2',
        title: 'L\'Énigme du Château Perdu',
        description: 'Mystère et aventure dans un château abandonné plein de secrets',
        genre: 'mystery',
        chapters: [
          {
            id: '1',
            title: 'La Découverte',
            content: 'En explorant la forêt, vous tombez sur un château oublié. Ses tours s\'élèvent vers le ciel sombre, et une étrange lumière vacille à l\'une des fenêtres...',
            choices: [
              {
                id: '1',
                text: 'Entrer immédiatement',
                consequence: 'Vous pénétrez dans le château par la porte principale',
                nextChapter: '2',
                impact: 'negative'
              },
              {
                id: '2',
                text: 'Observer d\'abord',
                consequence: 'Vous découvrez une entrée secrète',
                nextChapter: '2b',
                impact: 'positive'
              }
            ],
            mood: 'mystérieux',
            readingTime: 2,
            completed: true
          }
        ],
        protagonist: {
          name: 'Aventurier',
          traits: ['curieux', 'prudent', 'observateur'],
          background: 'Explorateur de lieux mystérieux',
          goals: ['Résoudre le mystère', 'Découvrir les secrets', 'Survivre'],
          avatar: '🔍'
        },
        mood: 'suspense',
        themes: ['mystère', 'exploration', 'secrets'],
        readingTime: 18,
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 25,
        rating: 4.5,
        favorite: false,
        personalizations: []
      }
    ];
    setStories(mockStories);
  };

  const loadTemplates = () => {
    const storyTemplates: StoryTemplate[] = [
      {
        id: '1',
        title: 'Voyage de Développement Personnel',
        description: 'Histoire inspirante de transformation et de croissance personnelle',
        genre: 'personal-growth',
        estimatedChapters: 8,
        personalizable: true,
        icon: '🌱',
        difficulty: 'simple'
      },
      {
        id: '2',
        title: 'Aventure Épique',
        description: 'Quête héroïque avec défis et découvertes',
        genre: 'adventure',
        estimatedChapters: 12,
        personalizable: true,
        icon: '⚔️',
        difficulty: 'medium'
      },
      {
        id: '3',
        title: 'Mystère à Résoudre',
        description: 'Enquête captivante avec indices et révélations',
        genre: 'mystery',
        estimatedChapters: 10,
        personalizable: true,
        icon: '🔍',
        difficulty: 'medium'
      },
      {
        id: '4',
        title: 'Romance Contemporaine',
        description: 'Histoire d\'amour moderne avec rebondissements',
        genre: 'romance',
        estimatedChapters: 15,
        personalizable: true,
        icon: '💕',
        difficulty: 'simple'
      },
      {
        id: '5',
        title: 'Science-Fiction Immersive',
        description: 'Futur technologique avec dilemmes éthiques',
        genre: 'sci-fi',
        estimatedChapters: 20,
        personalizable: true,
        icon: '🚀',
        difficulty: 'complex'
      },
      {
        id: '6',
        title: 'Monde Fantastique',
        description: 'Univers magique avec créatures et sorts',
        genre: 'fantasy',
        estimatedChapters: 18,
        personalizable: true,
        icon: '🧙‍♂️',
        difficulty: 'complex'
      }
    ];
    setTemplates(storyTemplates);
  };

  const generateStory = async (templateId: string) => {
    if (!storyPrompt.trim()) return;

    // Simulation de génération d'histoire
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newStory: Story = {
      id: Date.now().toString(),
      title: `Histoire Personnalisée - ${template.title}`,
      description: storyPrompt,
      genre: template.genre,
      chapters: [
        {
          id: '1',
          title: 'Chapitre 1: Le Commencement',
          content: 'Votre histoire commence ici, basée sur vos préférences personnelles...',
          mood: 'ouverture',
          readingTime: 5,
          completed: false,
          choices: [
            {
              id: '1',
              text: 'Continuer avec confiance',
              consequence: 'Vous avancez avec détermination',
              nextChapter: '2',
              impact: 'positive'
            }
          ]
        }
      ],
      protagonist: {
        name: 'Protagoniste',
        traits: ['déterminé', 'créatif'],
        background: 'Basé sur vos personnalisations',
        goals: ['Atteindre l\'objectif principal'],
        avatar: '🌟'
      },
      mood: 'personnalisé',
      themes: ['personnalisation', 'aventure'],
      readingTime: template.estimatedChapters * 5,
      created: new Date().toISOString(),
      progress: 0,
      rating: 0,
      favorite: false,
      personalizations: personalizations
    };

    setStories(prev => [newStory, ...prev]);
    setCurrentStory(newStory);
    setStoryPrompt('');
  };

  const startReading = (story: Story) => {
    setCurrentStory(story);
    setCurrentChapter(0);
    setIsReading(true);
    setActiveTab('reader');
  };

  const nextChapter = () => {
    if (currentStory && currentChapter < currentStory.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  const makeChoice = (choice: Choice) => {
    if (!currentStory) return;
    
    // Marquer le chapitre actuel comme complété
    const updatedStory = {
      ...currentStory,
      chapters: currentStory.chapters.map((chapter, index) => 
        index === currentChapter ? { ...chapter, completed: true } : chapter
      )
    };
    
    setCurrentStory(updatedStory);
    
    // Simuler la transition vers le prochain chapitre
    setTimeout(() => {
      nextChapter();
    }, 1000);
  };

  const getGenreColor = (genre: Story['genre']) => {
    switch (genre) {
      case 'adventure': return 'bg-red-500';
      case 'mystery': return 'bg-purple-500';
      case 'romance': return 'bg-pink-500';
      case 'fantasy': return 'bg-indigo-500';
      case 'sci-fi': return 'bg-blue-500';
      case 'personal-growth': return 'bg-green-500';
      case 'motivation': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: StoryTemplate['difficulty']) => {
    switch (difficulty) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getReadingProgress = () => {
    if (!currentStory) return 0;
    return Math.round((currentChapter / currentStory.chapters.length) * 100);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Story Synth</h1>
              <p className="text-gray-600">Créez et vivez vos histoires personnalisées</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{stories.length}</div>
              <div className="text-sm text-gray-600">Histoires créées</div>
            </div>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stories.length}</div>
              <div className="text-sm text-gray-600">Histoires totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stories.reduce((sum, s) => sum + s.readingTime, 0)} min
              </div>
              <div className="text-sm text-gray-600">Temps de lecture</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stories.filter(s => s.favorite).length}
              </div>
              <div className="text-sm text-gray-600">Favoris</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(stories.reduce((sum, s) => sum + s.rating, 0) / stories.length * 10) / 10 || 0}
              </div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </CardContent>
          </Card>
        </div>

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
            <TabsTrigger value="reader">Lecteur</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {/* Création d'histoire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Créer une nouvelle histoire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Décrivez votre histoire idéale</label>
                  <Textarea
                    placeholder="Exemple: Une histoire inspirante sur une personne qui surmonte ses peurs pour réaliser ses rêves. Je veux que le protagoniste me ressemble et que l'histoire se déroule dans ma ville..."
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Personnalisations optionnelles</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Nom du protagoniste</label>
                      <input
                        type="text"
                        placeholder="Votre nom ou nom de votre choix"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Lieu de l'histoire</label>
                      <input
                        type="text"
                        placeholder="Votre ville, un lieu imaginaire..."
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Thème principal</label>
                      <select className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option value="">Choisir un thème</option>
                        <option value="courage">Courage</option>
                        <option value="amour">Amour</option>
                        <option value="aventure">Aventure</option>
                        <option value="mystère">Mystère</option>
                        <option value="croissance">Croissance personnelle</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Longueur souhaitée</label>
                      <select className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option value="short">Courte (5-10 chapitres)</option>
                        <option value="medium">Moyenne (10-15 chapitres)</option>
                        <option value="long">Longue (15+ chapitres)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates d'histoires */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Modèles d'histoires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{template.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{template.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <Badge className={getGenreColor(template.genre)}>
                            {template.genre}
                          </Badge>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {template.estimatedChapters} chapitres
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(template.estimatedChapters * 5)}
                          </div>
                        </div>

                        {template.personalizable && (
                          <div className="flex items-center gap-1 text-xs text-purple-600">
                            <Sparkles className="w-3 h-3" />
                            <span>Personnalisable</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={() => generateStory(template.id)}
                        className="w-full"
                        disabled={!storyPrompt.trim()}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Générer cette histoire
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            {/* Filtres */}
            <div className="flex gap-2 flex-wrap">
              {['Toutes', 'personal-growth', 'adventure', 'mystery', 'romance', 'fantasy', 'sci-fi'].map((filter) => (
                <Button key={filter} variant="outline" size="sm" className="capitalize">
                  {filter === 'Toutes' ? 'Toutes' : filter.replace('-', ' ')}
                </Button>
              ))}
            </div>

            {/* Liste des histoires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2">
                        {story.favorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                        {story.title}
                      </CardTitle>
                      <Badge className={getGenreColor(story.genre)}>
                        {story.genre}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{story.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span>Progression:</span>
                        <span className="font-medium">{story.progress}%</span>
                      </div>
                      <Progress value={story.progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{story.chapters.length} chapitres</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(story.readingTime)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${
                              i < Math.floor(story.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-1 text-xs text-gray-600">({story.rating})</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(story.created).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-medium mb-2">Thèmes:</div>
                      <div className="flex flex-wrap gap-1">
                        {story.themes.map((theme, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-medium mb-1">Protagoniste:</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{story.protagonist.avatar}</span>
                        <span className="text-sm">{story.protagonist.name}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startReading(story)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {story.progress > 0 ? 'Continuer' : 'Commencer'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reader" className="space-y-6">
            {currentStory ? (
              <>
                {/* Contrôles de lecture */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{currentStory.protagonist.avatar}</div>
                        <div>
                          <h2 className="font-bold">{currentStory.title}</h2>
                          <p className="text-sm text-gray-600">
                            Chapitre {currentChapter + 1} / {currentStory.chapters.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={previousChapter} disabled={currentChapter === 0}>
                          <SkipForward className="w-4 h-4 rotate-180" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsReading(!isReading)}>
                          {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextChapter} disabled={currentChapter >= currentStory.chapters.length - 1}>
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Progress value={getReadingProgress()} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        Progression: {getReadingProgress()}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contenu du chapitre */}
                {currentStory.chapters[currentChapter] && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentStory.chapters[currentChapter].title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {currentStory.chapters[currentChapter].readingTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {currentStory.chapters[currentChapter].mood}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none mb-6">
                        <p className="text-lg leading-relaxed text-gray-800">
                          {currentStory.chapters[currentChapter].content}
                        </p>
                      </div>

                      {/* Choix interactifs */}
                      {currentStory.chapters[currentChapter].choices && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Que faites-vous ?</h4>
                          {currentStory.chapters[currentChapter].choices!.map((choice) => (
                            <Card 
                              key={choice.id} 
                              className={`cursor-pointer hover:shadow-md transition-all border-2 ${
                                choice.impact === 'positive' ? 'hover:border-green-300' :
                                choice.impact === 'negative' ? 'hover:border-red-300' :
                                'hover:border-blue-300'
                              }`}
                              onClick={() => makeChoice(choice)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    choice.impact === 'positive' ? 'bg-green-500' :
                                    choice.impact === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                                  }`} />
                                  <div>
                                    <div className="font-medium">{choice.text}</div>
                                    <div className="text-sm text-gray-600">{choice.consequence}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Navigation entre chapitres */}
                      <div className="flex justify-between items-center mt-6 pt-6 border-t">
                        <Button variant="outline" onClick={previousChapter} disabled={currentChapter === 0}>
                          Chapitre précédent
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button onClick={nextChapter} disabled={currentChapter >= currentStory.chapters.length - 1}>
                          Chapitre suivant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Aucune histoire sélectionnée</h3>
                  <p className="text-gray-600 mb-4">
                    Choisissez une histoire dans votre bibliothèque pour commencer la lecture
                  </p>
                  <Button onClick={() => setActiveTab('library')}>
                    Parcourir la bibliothèque
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Histoires populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Histoires populaires de la communauté
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Le Réveil du Phoenix',
                      author: 'Marie L.',
                      rating: 4.9,
                      reads: 1247,
                      genre: 'personal-growth',
                      description: 'Une histoire inspirante de renaissance après une période difficile'
                    },
                    {
                      title: 'Mystères de la Ville Oubliée',
                      author: 'Thomas R.',
                      rating: 4.7,
                      reads: 892,
                      genre: 'mystery',
                      description: 'Enquête palpitante dans une ville aux secrets enfouis'
                    },
                    {
                      title: 'L\'Amour au Temps du Digital',
                      author: 'Sophie M.',
                      rating: 4.8,
                      reads: 1563,
                      genre: 'romance',
                      description: 'Romance moderne entre technologie et émotions authentiques'
                    }
                  ].map((story, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                          {story.title[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold">{story.title}</h4>
                          <p className="text-sm text-gray-600">par {story.author}</p>
                          <p className="text-xs text-gray-500">{story.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${
                              i < Math.floor(story.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-1 text-xs">({story.rating})</span>
                        </div>
                        <div className="text-xs text-gray-500">{story.reads} lectures</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Défis d'écriture */}
            <Card>
              <CardHeader>
                <CardTitle>Défis d'écriture communautaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Histoire en 100 mots',
                      description: 'Racontez une histoire complète en exactement 100 mots',
                      participants: 45,
                      timeLeft: '3 jours'
                    },
                    {
                      title: 'Inspiration photo',
                      description: 'Créez une histoire basée sur l\'image du jour',
                      participants: 78,
                      timeLeft: '1 jour'
                    },
                    {
                      title: 'Genre mystère',
                      description: 'Écrivez un mystère en utilisant 3 objets imposés',
                      participants: 32,
                      timeLeft: '5 jours'
                    },
                    {
                      title: 'Dialogue sans description',
                      description: 'Racontez toute l\'histoire uniquement avec des dialogues',
                      participants: 23,
                      timeLeft: '2 jours'
                    }
                  ].map((challenge, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{challenge.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {challenge.participants} participants
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {challenge.timeLeft}
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          Participer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StorySynthPage;