import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Sparkles, Play, Pause, RotateCcw, Download, Share2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'healing' | 'motivation' | 'growth' | 'adventure';
  prompts: string[];
  example: string;
}

interface GeneratedStory {
  id: string;
  title: string;
  content: string;
  category: string;
  mood: string;
  createdAt: Date;
  audioUrl?: string;
  duration?: number;
}

const B2CStorySynthPageEnhanced: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');

  const { toast } = useToast();

  const storyTemplates: StoryTemplate[] = [
    {
      id: 'healing-journey',
      name: 'Voyage de Guérison',
      description: 'Une histoire de transformation personnelle et de guérison émotionnelle',
      category: 'healing',
      prompts: [
        'Quel défi personnel souhaitez-vous surmonter ?',
        'Quel est votre lieu de paix idéal ?',
        'Quelle qualité admirez-vous le plus chez vous ?'
      ],
      example: 'Une histoire où le héros traverse un jardin magique pour guérir ses blessures intérieures...'
    },
    {
      id: 'motivation-quest',
      name: 'Quête Motivationnelle',
      description: 'Une aventure épique qui réveille votre courage et votre détermination',
      category: 'motivation',
      prompts: [
        'Quel objectif vous tient le plus à cœur ?',
        'Quel obstacle vous semble insurmontable ?',
        'Quelle est votre plus grande source de force ?'
      ],
      example: 'L\'histoire d\'un héros qui gravit une montagne sacrée pour atteindre ses rêves...'
    },
    {
      id: 'growth-fable',
      name: 'Fable de Croissance',
      description: 'Un conte sage qui illustre votre potentiel de développement personnel',
      category: 'growth',
      prompts: [
        'Dans quel domaine souhaitez-vous grandir ?',
        'Quelle leçon de vie avez-vous récemment apprise ?',
        'Quel conseil donneriez-vous à votre moi du passé ?'
      ],
      example: 'La métamorphose d\'une chenille qui découvre sa véritable nature de papillon...'
    },
    {
      id: 'adventure-escape',
      name: 'Évasion Aventureuse',
      description: 'Une aventure palpitante qui vous transporte dans un monde extraordinaire',
      category: 'adventure',
      prompts: [
        'Quel monde fantastique vous attire le plus ?',
        'Quel super-pouvoir aimeriez-vous posséder ?',
        'Quelle découverte changerait votre vie ?'
      ],
      example: 'Un voyage à travers des dimensions parallèles à la recherche d\'un trésor mystique...'
    }
  ];

  // Simulation de génération d'histoire
  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        generateStory();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  const generateStory = () => {
    if (!selectedTemplate) return;
    
    const story: GeneratedStory = {
      id: Date.now().toString(),
      title: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
      content: generateStoryContent(),
      category: selectedTemplate.category,
      mood: getMoodFromCategory(selectedTemplate.category),
      createdAt: new Date(),
      duration: Math.floor(Math.random() * 300) + 180 // 3-8 minutes
    };
    
    setCurrentStory(story);
    setGeneratedStories(prev => [story, ...prev.slice(0, 9)]);
    setIsGenerating(false);
    
    toast({
      title: "Histoire générée !",
      description: "Votre histoire personnalisée est prête à être découverte",
    });
  };

  const generateStoryContent = (): string => {
    const stories = {
      'healing-journey': `Il était une fois une âme en quête de paix, qui découvrit un jardin secret où chaque fleur représentait une émotion. 
      
Au cœur de ce jardin magique, elle rencontra un sage jardinier qui lui enseigna que même les plus belles roses ont des épines, et que la beauté naît souvent de nos cicatrices.

Jour après jour, l'âme apprit à cultiver ses émotions comme on cultive un jardin : avec patience, amour et bienveillance. Elle comprit que guérir ne signifie pas oublier, mais apprendre à transformer sa douleur en sagesse.

Lorsqu'elle quitta le jardin, elle emporta avec elle une graine spéciale : la graine de l'acceptation de soi. Cette graine grandirait en elle, créant son propre jardin intérieur, source inépuisable de paix et de résilience.`,

      'motivation-quest': `Dans un royaume lointain vivait un héros ordinaire face à une montagne extraordinaire. Cette montagne, disait-on, exauçait les rêves de ceux qui atteignaient son sommet.

Le chemin était ardu, parsemé d'obstacles qui semblaient insurmontables. À chaque étape, le héros était tenté d'abandonner, mais une voix intérieure lui murmurait : "Tu es plus fort que tu ne le crois."

Il rencontra d'autres voyageurs qui avaient renoncé, mais aussi des guides bienveillants qui partageaient leur sagesse. Il apprit que la vraie force ne vient pas de l'absence de peur, mais du courage de continuer malgré elle.

Au sommet, il découvrit que le véritable trésor n'était pas l'exaucement de ses vœux, mais la personne qu'il était devenu durant l'ascension. Il redescendit transformé, porteur d'une lumière qui inspirait tous ceux qu'il croisait.`,

      'growth-fable': `Un jeune arbre poussait dans l'ombre d'un chêne centenaire, se lamentant de ne jamais pouvoir devenir aussi grand et majestueux que son aîné.

Un jour, une tempête abattit le grand chêne. Le jeune arbre pleura la perte de son protecteur, mais découvrit bientôt quelque chose de merveilleux : la lumière du soleil l'atteignait enfin directement.

Semaine après semaine, il grandit avec une vigueur nouvelle. Il réalisa que l'ombre du chêne, qu'il croyait protectrice, limitait en réalité son potentiel. Il apprit que chaque être a sa propre façon de grandir et sa propre beauté.

Des années plus tard, devenu un arbre magnifique, il offrit son ombre à de jeunes pousses, comprenant que la vraie grandeur consiste à aider les autres à révéler leur propre potentiel.`,

      'adventure-escape': `Dans une bibliothèque oubliée, un livre ancien s'ouvrit spontanément, révélant un portail vers un monde de merveilles infinies.

L'aventurier franchit le seuil et découvrit un univers où les émotions prennent forme, où les rêves deviennent réalité et où chaque pensée positive fait naître une nouvelle étoile dans le ciel.

Il voyagea à travers des forêts de cristal chantant, navigua sur des océans de lumière dorée et vola au-dessus de montagnes flottantes peuplées de créatures bienveillantes.

Chaque rencontre lui enseignait quelque chose de nouveau sur lui-même. Il comprit que ce monde magique existait en réalité dans son cœur, et qu'il pouvait y accéder à tout moment en fermant les yeux et en laissant son imagination s'envoler.`
    };
    
    return stories[selectedTemplate?.id as keyof typeof stories] || stories['healing-journey'];
  };

  const getMoodFromCategory = (category: string): string => {
    const moods = {
      healing: 'Apaisant',
      motivation: 'Énergisant',
      growth: 'Inspirant',
      adventure: 'Excitant'
    };
    return moods[category as keyof typeof moods] || 'Neutre';
  };

  const startGeneration = () => {
    if (!selectedTemplate) {
      toast({
        title: "Sélection requise",
        description: "Veuillez choisir un template d'histoire",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    toast({
      title: "Génération en cours...",
      description: "Votre histoire personnalisée est en cours de création",
    });
  };

  const generateFromCustomPrompt = () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Prompt requis",
        description: "Veuillez entrer une description pour votre histoire",
        variant: "destructive"
      });
      return;
    }
    
    const story: GeneratedStory = {
      id: Date.now().toString(),
      title: `Histoire Personnalisée - ${new Date().toLocaleDateString()}`,
      content: `Basée sur votre demande : "${customPrompt}"\n\n${generateStoryContent()}`,
      category: 'custom',
      mood: 'Personnalisé',
      createdAt: new Date(),
      duration: Math.floor(Math.random() * 300) + 180
    };
    
    setCurrentStory(story);
    setGeneratedStories(prev => [story, ...prev.slice(0, 9)]);
    
    toast({
      title: "Histoire personnalisée créée !",
      description: "Votre histoire unique est prête",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'healing': return 'bg-green-100 text-green-800';
      case 'motivation': return 'bg-blue-100 text-blue-800';
      case 'growth': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            📖 Story Synth Lab
          </h1>
          <p className="text-xl text-gray-300">
            Créez des histoires thérapeutiques personnalisées avec l'IA
          </p>
        </motion.div>

        {/* Génération en cours */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-pink-400">
                <CardContent className="p-8 text-center space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mx-auto"
                  >
                    <Wand2 className="w-16 h-16 text-pink-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white">
                    Création de votre histoire...
                  </h2>
                  
                  <div className="space-y-2 text-gray-300">
                    <div>✨ Analyse de vos préférences</div>
                    <div>🎭 Génération du scénario</div>
                    <div>📝 Rédaction personnalisée</div>
                    <div>🎵 Préparation audio (optionnel)</div>
                  </div>
                  
                  <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Créer
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Prompt Libre
            </TabsTrigger>
          </TabsList>

          {/* Création d'histoire */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storyTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Card 
                    className={`bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all h-full ${
                      selectedTemplate?.id === template.id ? 'border-pink-400' : ''
                    }`}
                  >
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">
                          {template.category === 'healing' && '🌱'}
                          {template.category === 'motivation' && '🚀'}
                          {template.category === 'growth' && '🦋'}
                          {template.category === 'adventure' && '⭐'}
                        </div>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                        <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                        
                        <div className="text-xs text-gray-400 mb-2">Exemple:</div>
                        <p className="text-xs text-gray-500 italic mb-4">{template.example}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-400">Questions personnalisées:</div>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {template.prompts.slice(0, 2).map((prompt, i) => (
                            <li key={i}>• {prompt}</li>
                          ))}
                          {template.prompts.length > 2 && (
                            <li>• +{template.prompts.length - 2} autres...</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Personnalisation - {selectedTemplate.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      Répondez aux questions pour créer une histoire unique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTemplate.prompts.map((prompt, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-white text-sm">{prompt}</label>
                        <Input
                          placeholder="Votre réponse..."
                          value={userInputs[index] || ''}
                          onChange={(e) => setUserInputs(prev => ({
                            ...prev,
                            [index]: e.target.value
                          }))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    ))}
                    
                    <Button 
                      onClick={startGeneration}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
                      disabled={isGenerating}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Générer mon Histoire
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Bibliothèque */}
          <TabsContent value="library" className="space-y-6">
            {currentStory && (
              <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    {currentStory.title}
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(currentStory.category)}>
                        {currentStory.mood}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {currentStory.content}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isPlaying ? 'Pause' : 'Écouter'}
                      </Button>
                      
                      {currentStory.duration && (
                        <span className="text-gray-400 text-sm">
                          Durée: {Math.floor(currentStory.duration / 60)}:{(currentStory.duration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedStories.map((story, index) => (
                <Card 
                  key={story.id}
                  className="bg-black/30 border-white/10 backdrop-blur-xl hover:bg-black/40 transition-all cursor-pointer"
                  onClick={() => setCurrentStory(story)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{story.title}</h3>
                      <Badge className={getCategoryColor(story.category)}>
                        {story.mood}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">
                      {story.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-gray-300 text-xs line-clamp-3">
                      {story.content.substring(0, 100)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prompt libre */}
          <TabsContent value="custom" className="space-y-6">
            <Card className="bg-black/30 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Création Libre</CardTitle>
                <CardDescription className="text-gray-300">
                  Décrivez l'histoire que vous souhaitez et laissez l'IA créer pour vous
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Décrivez votre histoire idéale... (ex: Une histoire apaisante sur la confiance en soi, avec des métaphores de nature)"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-white/10 border-white/20 text-white min-h-32"
                />
                
                <Button 
                  onClick={generateFromCustomPrompt}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Créer mon Histoire Unique
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CStorySynthPageEnhanced;