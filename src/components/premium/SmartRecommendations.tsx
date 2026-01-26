// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Music, Heart, Star, Sparkles, 
  TrendingUp, Clock, Target, Users, PlayCircle,
  BookOpen, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  type: 'music' | 'exercise' | 'meditation' | 'journal' | 'community' | 'coach';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  category: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personalizedFor: string[];
  benefits: string[];
  thumbnail?: string;
  rating: number;
  completions: number;
}

interface SmartRecommendationsProps {
  userId?: string;
  currentEmotion?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  userPreferences?: string[];
  className?: string;
  maxRecommendations?: number;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userId,
  currentEmotion = 'neutral',
  timeOfDay = 'afternoon',
  userPreferences = [],
  className,
  maxRecommendations = 6
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [personalizedScore, setPersonalizedScore] = useState(85);

  useEffect(() => {
    // Simuler l'IA de recommandation
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      // Simuler un délai de traitement IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'music',
          title: 'Mélodies Apaisantes du Soir',
          description: 'Playlist personnalisée basée sur votre état émotionnel actuel',
          reason: `Parfait pour votre humeur ${currentEmotion} en cette ${timeOfDay}`,
          confidence: 95,
          category: 'Musicothérapie',
          estimatedTime: 15,
          difficulty: 'beginner',
          personalizedFor: ['relaxation', 'stress-relief'],
          benefits: ['Réduction du stress', 'Amélioration de l\'humeur', 'Relaxation profonde'],
          rating: 4.8,
          completions: 1247
        },
        {
          id: '2',
          type: 'meditation',
          title: 'Méditation Guidée Personnalisée',
          description: 'Session adaptée à votre niveau de stress et vos objectifs',
          reason: 'Recommandé pour votre profil émotionnel',
          confidence: 88,
          category: 'Méditation',
          estimatedTime: 10,
          difficulty: 'intermediate',
          personalizedFor: ['mindfulness', 'emotional-balance'],
          benefits: ['Clarté mentale', 'Équilibre émotionnel', 'Présence'],
          rating: 4.9,
          completions: 892
        },
        {
          id: '3',
          type: 'exercise',
          title: 'Respiration Énergisante',
          description: 'Techniques de respiration pour booster votre énergie',
          reason: 'Idéal pour cette période de la journée',
          confidence: 92,
          category: 'Breathwork',
          estimatedTime: 5,
          difficulty: 'beginner',
          personalizedFor: ['energy-boost', 'focus'],
          benefits: ['Énergie naturelle', 'Concentration', 'Vitalité'],
          rating: 4.7,
          completions: 2156
        },
        {
          id: '4',
          type: 'journal',
          title: 'Réflexion Guidée du Jour',
          description: 'Questions personnalisées pour votre développement',
          reason: 'Basé sur vos sessions précédentes',
          confidence: 85,
          category: 'Journal',
          estimatedTime: 8,
          difficulty: 'intermediate',
          personalizedFor: ['self-reflection', 'growth'],
          benefits: ['Conscience de soi', 'Croissance personnelle', 'Clarté'],
          rating: 4.6,
          completions: 654
        },
        {
          id: '5',
          type: 'community',
          title: 'Groupe de Soutien Actuel',
          description: 'Rejoignez une discussion en cours avec des membres similaires',
          reason: 'Profils compatibles avec le vôtre',
          confidence: 78,
          category: 'Connexion',
          estimatedTime: 20,
          difficulty: 'beginner',
          personalizedFor: ['social-support', 'sharing'],
          benefits: ['Connexion sociale', 'Soutien mutuel', 'Partage'],
          rating: 4.5,
          completions: 445
        },
        {
          id: '6',
          type: 'coach',
          title: 'Session Coaching IA Personnalisée',
          description: 'Conversation adaptée à vos objectifs personnels',
          reason: 'Analyse de vos patterns comportementaux',
          confidence: 91,
          category: 'Développement',
          estimatedTime: 12,
          difficulty: 'advanced',
          personalizedFor: ['goal-setting', 'motivation'],
          benefits: ['Motivation', 'Objectifs clairs', 'Action plan'],
          rating: 4.9,
          completions: 789
        }
      ];

      setRecommendations(mockRecommendations.slice(0, maxRecommendations));
      setIsLoading(false);
    };

    generateRecommendations();
  }, [currentEmotion, timeOfDay, maxRecommendations]);

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'music': return <Music className="w-5 h-5" />;
      case 'exercise': return <Activity className="w-5 h-5" />;
      case 'meditation': return <Brain className="w-5 h-5" />;
      case 'journal': return <BookOpen className="w-5 h-5" />;
      case 'community': return <Users className="w-5 h-5" />;
      case 'coach': return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'music': return 'text-purple-400 bg-purple-500/10';
      case 'exercise': return 'text-green-400 bg-green-500/10';
      case 'meditation': return 'text-blue-400 bg-blue-500/10';
      case 'journal': return 'text-amber-400 bg-amber-500/10';
      case 'community': return 'text-pink-400 bg-pink-500/10';
      case 'coach': return 'text-cyan-400 bg-cyan-500/10';
    }
  };

  const getDifficultyColor = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 border-green-400/30';
      case 'intermediate': return 'text-amber-400 border-amber-400/30';
      case 'advanced': return 'text-red-400 border-red-400/30';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === selectedCategory);

  if (isLoading) {
    return (
      <Card className={cn("bg-gradient-to-br from-background/95 to-accent/5", className)}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-y-4">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto"
              >
                <Brain className="w-12 h-12 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold">IA en cours d'analyse...</h3>
                <p className="text-sm text-muted-foreground">
                  Personnalisation de vos recommandations
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header avec score de personnalisation */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Recommandations IA
          </h2>
          <p className="text-sm text-muted-foreground">
            Personnalisées pour vous • Score de précision: {personalizedScore}%
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">IA Premium</span>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            {recommendations.length} suggestions
          </Badge>
        </motion.div>
      </div>

      {/* Filtres de catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Toutes', icon: <Sparkles className="w-4 h-4" /> },
          { key: 'music', label: 'Musique', icon: <Music className="w-4 h-4" /> },
          { key: 'meditation', label: 'Méditation', icon: <Brain className="w-4 h-4" /> },
          { key: 'exercise', label: 'Exercices', icon: <Activity className="w-4 h-4" /> },
          { key: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
          { key: 'community', label: 'Communauté', icon: <Users className="w-4 h-4" /> },
          { key: 'coach', label: 'Coach', icon: <Target className="w-4 h-4" /> }
        ].map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.key)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {category.icon}
            {category.label}
          </Button>
        ))}
      </div>

      {/* Grille de recommandations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-background/95 to-primary/5 border-primary/20 hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header avec type et confiance */}
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-2 rounded-lg flex items-center gap-2",
                      getTypeColor(recommendation.type)
                    )}>
                      {getTypeIcon(recommendation.type)}
                      <span className="text-sm font-medium">
                        {recommendation.category}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {recommendation.confidence}% match
                      </Badge>
                    </div>
                  </div>

                  {/* Titre et description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg leading-tight">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {recommendation.description}
                    </p>
                    <p className="text-xs text-primary italic">
                      💡 {recommendation.reason}
                    </p>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recommendation.estimatedTime}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {recommendation.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recommendation.completions}
                    </div>
                  </div>

                  {/* Difficulté */}
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs w-fit", getDifficultyColor(recommendation.difficulty))}
                  >
                    {recommendation.difficulty}
                  </Badge>

                  {/* Bénéfices */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Bénéfices:</p>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.benefits.slice(0, 3).map((benefit, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Commencer
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action pour plus de recommandations */}
      <div className="text-center">
        <Button
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Générer Plus de Recommandations IA
        </Button>
      </div>
    </div>
  );
};

export default SmartRecommendations;