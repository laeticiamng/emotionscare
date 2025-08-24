
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Rocket, 
  Brain, 
  Zap, 
  Star, 
  Users, 
  TrendingUp,
  Eye,
  Heart,
  Cpu,
  Atom,
  Beaker,
  Play,
  Vote,
  MessageCircle,
  CheckCircle,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface Innovation {
  id: string;
  title: string;
  description: string;
  category: 'ai' | 'vr' | 'biometric' | 'social' | 'data';
  status: 'concept' | 'development' | 'testing' | 'ready';
  progress: number;
  votes: number;
  contributors: number;
  impact: 'low' | 'medium' | 'high';
  icon: React.ReactElement;
  features: string[];
  timeline: string;
}

const InnovationPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [votedInnovations, setVotedInnovations] = useState<Set<string>>(new Set());

  const innovations: Innovation[] = [
    {
      id: '1',
      title: 'IA Émotionnelle Prédictive',
      description: 'Algorithme d\'apprentissage automatique pour anticiper les états émotionnels avant qu\'ils ne surviennent',
      category: 'ai',
      status: 'development',
      progress: 75,
      votes: 234,
      contributors: 8,
      impact: 'high',
      icon: <Brain className="h-6 w-6" />,
      features: ['Prédiction 24h', 'Recommandations IA', 'Intégration IoT'],
      timeline: '3 mois'
    },
    {
      id: '2',
      title: 'Environnements VR Thérapeutiques',
      description: 'Espaces de réalité virtuelle immersifs avec biofeedback en temps réel pour la thérapie',
      category: 'vr',
      status: 'testing',
      progress: 90,
      votes: 189,
      contributors: 12,
      impact: 'high',
      icon: <Eye className="h-6 w-6" />,
      features: ['Biofeedback', '20+ environnements', 'Sessions guidées'],
      timeline: '1 mois'
    },
    {
      id: '3',
      title: 'Capteurs Biométriques Portables',
      description: 'Dispositifs IoT non-invasifs pour surveiller les signaux physiologiques en continu',
      category: 'biometric',
      status: 'concept',
      progress: 25,
      votes: 156,
      contributors: 5,
      impact: 'medium',
      icon: <Heart className="h-6 w-6" />,
      features: ['Non-invasif', 'Batterie 7 jours', 'Sync temps réel'],
      timeline: '6 mois'
    },
    {
      id: '4',
      title: 'Réseau Social Empathique',
      description: 'Plateforme communautaire avec algorithmes de matching basés sur la compatibilité émotionnelle',
      category: 'social',
      status: 'development',
      progress: 60,
      votes: 298,
      contributors: 15,
      impact: 'high',
      icon: <Users className="h-6 w-6" />,
      features: ['Matching intelligent', 'Groupes thématiques', 'Modération IA'],
      timeline: '4 mois'
    },
    {
      id: '5',
      title: 'Jumeau Numérique Émotionnel',
      description: 'Représentation 3D personnalisée de votre état émotionnel en temps réel',
      category: 'data',
      status: 'concept',
      progress: 15,
      votes: 87,
      contributors: 3,
      impact: 'medium',
      icon: <Atom className="h-6 w-6" />,
      features: ['Visualisation 3D', 'Historique', 'Partage sécurisé'],
      timeline: '8 mois'
    },
    {
      id: '6',
      title: 'Assistant IA Conversationnel',
      description: 'Chatbot thérapeutique avancé avec compréhension contextuelle et réponses empathiques',
      category: 'ai',
      status: 'ready',
      progress: 100,
      votes: 421,
      contributors: 20,
      impact: 'high',
      icon: <MessageCircle className="h-6 w-6" />,
      features: ['NLP avancé', 'Voix naturelle', 'Apprentissage continu'],
      timeline: 'Disponible'
    }
  ];

  const categoryIcons = {
    ai: <Brain className="h-4 w-4" />,
    vr: <Eye className="h-4 w-4" />,
    biometric: <Heart className="h-4 w-4" />,
    social: <Users className="h-4 w-4" />,
    data: <Atom className="h-4 w-4" />
  };

  const statusColors = {
    concept: 'bg-gray-100 text-gray-800',
    development: 'bg-blue-100 text-blue-800',
    testing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800'
  };

  const impactColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const filteredInnovations = selectedCategory === 'all' 
    ? innovations 
    : innovations.filter(innovation => innovation.category === selectedCategory);

  const handleVote = (innovationId: string) => {
    if (votedInnovations.has(innovationId)) {
      toast.info('Vous avez déjà voté pour cette innovation');
      return;
    }
    
    setVotedInnovations(prev => new Set(prev).add(innovationId));
    toast.success('Vote enregistré ! Merci pour votre soutien 🚀');
  };

  const stats = {
    totalInnovations: innovations.length,
    inDevelopment: innovations.filter(i => i.status === 'development').length,
    ready: innovations.filter(i => i.status === 'ready').length,
    totalVotes: innovations.reduce((sum, i) => sum + i.votes, 0)
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Lightbulb className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Innovation Lab
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez les technologies révolutionnaires qui transformeront l'avenir du bien-être émotionnel. 
            Participez au développement des innovations de demain.
          </p>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Rocket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalInnovations}</div>
              <p className="text-sm text-gray-600">Innovations totales</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Cpu className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.inDevelopment}</div>
              <p className="text-sm text-gray-600">En développement</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
              <p className="text-sm text-gray-600">Prêtes</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Vote className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.totalVotes}</div>
              <p className="text-sm text-gray-600">Votes totaux</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="innovations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="innovations">Innovations</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>

          <TabsContent value="innovations">
            {/* Category Filter */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Toutes
                  </Button>
                  {Object.entries(categoryIcons).map(([category, icon]) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category)}
                      className="flex items-center gap-2"
                    >
                      {icon}
                      {category.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Innovations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInnovations.map((innovation, index) => (
                <motion.div
                  key={innovation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            {innovation.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{innovation.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge className={statusColors[innovation.status]}>
                                {innovation.status}
                              </Badge>
                              <Badge className={impactColors[innovation.impact]}>
                                Impact {innovation.impact}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {innovation.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progression</span>
                            <span className="text-sm font-medium">{innovation.progress}%</span>
                          </div>
                          <Progress value={innovation.progress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-800">Fonctionnalités clés:</h4>
                          <div className="flex flex-wrap gap-1">
                            {innovation.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Vote className="h-4 w-4" />
                              <span>{innovation.votes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{innovation.contributors}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{innovation.timeline}</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleVote(innovation.id)}
                            disabled={votedInnovations.has(innovation.id)}
                            className={`${
                              votedInnovations.has(innovation.id) 
                                ? 'bg-gray-400' 
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            {votedInnovations.has(innovation.id) ? 'Voté' : 'Voter'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Roadmap d'Innovation 2024-2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-blue-200"></div>
                    
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Q1 2024 - Assistant IA Conversationnel</h3>
                          <p className="text-sm text-gray-600">Déploiement de l'assistant IA avec NLP avancé</p>
                          <Badge className="mt-1 bg-green-100 text-green-800">Terminé</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Cpu className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Q2 2024 - Environnements VR Thérapeutiques</h3>
                          <p className="text-sm text-gray-600">Lancement des premiers environnements VR avec biofeedback</p>
                          <Badge className="mt-1 bg-blue-100 text-blue-800">En cours</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Brain className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Q3 2024 - IA Émotionnelle Prédictive</h3>
                          <p className="text-sm text-gray-600">Algorithmes de prédiction émotionnelle 24h à l'avance</p>
                          <Badge className="mt-1 bg-gray-100 text-gray-800">Planifié</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Q4 2024 - Capteurs Biométriques</h3>
                          <p className="text-sm text-gray-600">Intégration des capteurs IoT non-invasifs</p>
                          <Badge className="mt-1 bg-gray-100 text-gray-800">Recherche</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Communauté Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium text-green-800">Programme Beta</h3>
                      <p className="text-sm text-green-600">Accès privilégié aux nouvelles fonctionnalités</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium text-blue-800">Feedback Direct</h3>
                      <p className="text-sm text-blue-600">Influence directe sur le développement</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium text-purple-800">Proposer des Idées</h3>
                      <p className="text-sm text-purple-600">Soumettez vos propres innovations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Rejoindre l'Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Participez au développement des technologies de demain et aidez à façonner l'avenir du bien-être émotionnel.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Rocket className="h-4 w-4 mr-2" />
                      Rejoindre le Programme Beta
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Proposer une Innovation
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discussions Communauté
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InnovationPage;
