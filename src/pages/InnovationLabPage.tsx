
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageCircle
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

interface ExperimentalFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  betaUsers: number;
}

const InnovationLabPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [votedInnovations, setVotedInnovations] = useState<Set<string>>(new Set());

  const innovations: Innovation[] = [
    {
      id: '1',
      title: 'IA Prédictive Émotionnelle',
      description: 'Algorithme d\'apprentissage automatique pour prédire les états émotionnels avant qu\'ils ne surviennent',
      category: 'ai',
      status: 'development',
      progress: 75,
      votes: 234,
      contributors: 8,
      impact: 'high',
      icon: <Brain className="h-6 w-6" />,
      features: ['Prédiction 24h à l\'avance', 'Recommandations personnalisées', 'Intégration IoT'],
      timeline: '3 mois'
    },
    {
      id: '2',
      title: 'Thérapie VR Immersive',
      description: 'Environnements de réalité virtuelle thérapeutiques avec biofeedback en temps réel',
      category: 'vr',
      status: 'testing',
      progress: 90,
      votes: 189,
      contributors: 12,
      impact: 'high',
      icon: <Eye className="h-6 w-6" />,
      features: ['Biofeedback intégré', '20+ environnements', 'Sessions guidées'],
      timeline: '1 mois'
    },
    {
      id: '3',
      title: 'Capteurs Émotionnels Portables',
      description: 'Dispositifs IoT pour monitorer les signaux physiologiques et détecter les émotions',
      category: 'biometric',
      status: 'concept',
      progress: 25,
      votes: 156,
      contributors: 5,
      impact: 'medium',
      icon: <Heart className="h-6 w-6" />,
      features: ['Capteurs non-invasifs', 'Batterie 7 jours', 'Sync automatique'],
      timeline: '6 mois'
    },
    {
      id: '4',
      title: 'Réseau Social Thérapeutique',
      description: 'Plateforme de soutien communautaire avec matching algorithmique basé sur les profils émotionnels',
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
      description: 'Modèle 3D personnalisé représentant l\'état émotionnel de l\'utilisateur en temps réel',
      category: 'data',
      status: 'concept',
      progress: 15,
      votes: 87,
      contributors: 3,
      impact: 'medium',
      icon: <Atom className="h-6 w-6" />,
      features: ['Visualisation 3D', 'Historique émotionnel', 'Partage sécurisé'],
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

  const experimentalFeatures: ExperimentalFeature[] = [
    {
      id: '1',
      name: 'Mode Sombre Adaptatif',
      description: 'Ajustement automatique du thème selon l\'heure et l\'humeur',
      enabled: false,
      riskLevel: 'low',
      betaUsers: 150
    },
    {
      id: '2',
      name: 'Notifications Prédictives',
      description: 'Alertes basées sur l\'analyse prédictive des patterns émotionnels',
      enabled: false,
      riskLevel: 'medium',
      betaUsers: 75
    },
    {
      id: '3',
      name: 'Intégration Calendrier Intelligent',
      description: 'Suggestions d\'activités basées sur les prévisions émotionnelles',
      enabled: false,
      riskLevel: 'low',
      betaUsers: 200
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

  const riskColors = {
    low: 'bg-green-100 text-green-800',
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

  const toggleExperimentalFeature = (featureId: string) => {
    toast.info('Fonctionnalité expérimentale activée - Rechargement requis');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Innovation Lab
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez les innovations de demain en matière de bien-être émotionnel. 
            Participez au développement des fonctionnalités futures d'EmotionsCare.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="innovations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="innovations">Innovations</TabsTrigger>
              <TabsTrigger value="experimental">Fonctionnalités Beta</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
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
                <AnimatePresence>
                  {filteredInnovations.map((innovation, index) => (
                    <motion.div
                      key={innovation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
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
                                  <TrendingUp className="h-4 w-4" />
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
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="experimental">
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-orange-600" />
                      Fonctionnalités Expérimentales
                    </CardTitle>
                    <p className="text-gray-600">
                      Testez les dernières fonctionnalités en développement. Ces features peuvent être instables.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experimentalFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-800">{feature.name}</h3>
                              <Badge className={riskColors[feature.riskLevel]}>
                                Risque {feature.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Users className="h-3 w-3" />
                              <span>{feature.betaUsers} testeurs beta</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => toggleExperimentalFeature(feature.id)}
                            variant={feature.enabled ? "default" : "outline"}
                            size="sm"
                          >
                            {feature.enabled ? 'Désactiver' : 'Activer'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Rejoindre le Programme Beta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Devenez testeur beta et accédez en avant-première aux nouvelles fonctionnalités d'EmotionsCare.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Rocket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-blue-800">Accès Prioritaire</h4>
                        <p className="text-sm text-blue-600">Nouvelles features en premier</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-green-800">Feedback Direct</h4>
                        <p className="text-sm text-green-600">Influence le développement</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-purple-800">Communauté VIP</h4>
                        <p className="text-sm text-purple-600">Accès au canal beta privé</p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Rocket className="h-4 w-4 mr-2" />
                      Rejoindre le Programme Beta
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roadmap">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Roadmap 2024-2025
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[
                      {
                        quarter: 'Q1 2024',
                        title: 'Fondations IA',
                        status: 'completed',
                        items: ['Assistant IA conversationnel', 'Analyse prédictive de base', 'API Machine Learning']
                      },
                      {
                        quarter: 'Q2 2024',
                        title: 'Expériences Immersives',
                        status: 'in-progress',
                        items: ['Thérapie VR complète', 'Environnements adaptatifs', 'Biofeedback intégré']
                      },
                      {
                        quarter: 'Q3 2024',
                        title: 'Écosystème Connecté',
                        status: 'planned',
                        items: ['Capteurs IoT', 'Intégrations wearables', 'Dashboard unifié']
                      },
                      {
                        quarter: 'Q4 2024',
                        title: 'Communauté & Social',
                        status: 'planned',
                        items: ['Réseau social thérapeutique', 'Groupes de soutien', 'Matching algorithmique']
                      },
                      {
                        quarter: 'Q1 2025',
                        title: 'Intelligence Avancée',
                        status: 'future',
                        items: ['Jumeau numérique émotionnel', 'Prédiction long terme', 'Personnalisation extrême']
                      }
                    ].map((roadmapItem, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start gap-4">
                          <div className={`w-4 h-4 rounded-full mt-2 ${
                            roadmapItem.status === 'completed' ? 'bg-green-500' :
                            roadmapItem.status === 'in-progress' ? 'bg-blue-500' :
                            roadmapItem.status === 'planned' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{roadmapItem.title}</h3>
                              <Badge variant="outline">{roadmapItem.quarter}</Badge>
                              <Badge className={
                                roadmapItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                                roadmapItem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                roadmapItem.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {roadmapItem.status === 'completed' ? 'Terminé' :
                                 roadmapItem.status === 'in-progress' ? 'En cours' :
                                 roadmapItem.status === 'planned' ? 'Planifié' :
                                 'Futur'}
                              </Badge>
                            </div>
                            <ul className="space-y-1">
                              {roadmapItem.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {index < 4 && (
                          <div className="absolute left-2 top-8 w-0.5 h-8 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InnovationLabPage;
