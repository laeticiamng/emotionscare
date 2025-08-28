import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Volume2, 
         Headphones, Globe, Mountain, Waves, Trees, Sun, Moon, 
         Timer, Heart, Brain, Eye, Zap } from 'lucide-react';

interface VRExperience {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'relaxation' | 'meditation' | 'nature' | 'focus' | 'energy';
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  environment: string;
  icon: string;
  benefits: string[];
}

const B2CVRPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeExperience, setActiveExperience] = useState<VRExperience | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const vrExperiences: VRExperience[] = [
    {
      id: '1',
      title: 'Plage Tropicale Zen',
      description: 'Détendez-vous sur une plage paradisiaque avec le son des vagues et des palmiers',
      duration: '15 min',
      category: 'relaxation',
      difficulty: 'débutant',
      environment: 'Océan tropical',
      icon: '🏖️',
      benefits: ['Réduction du stress', 'Relaxation profonde', 'Amélioration du sommeil']
    },
    {
      id: '2',
      title: 'Forêt Méditative',
      description: 'Immersion dans une forêt mystique pour une méditation guidée profonde',
      duration: '20 min',
      category: 'meditation',
      difficulty: 'intermédiaire',
      environment: 'Forêt enchantée',
      icon: '🌲',
      benefits: ['Concentration', 'Pleine conscience', 'Équilibre mental']
    },
    {
      id: '3',
      title: 'Montagne Énergisante',
      description: 'Réveillez votre énergie au sommet d\'une montagne majestueuse',
      duration: '10 min',
      category: 'energy',
      difficulty: 'débutant',
      environment: 'Sommet montagneux',
      icon: '⛰️',
      benefits: ['Boost d\'énergie', 'Motivation', 'Clarté mentale']
    },
    {
      id: '4',
      title: 'Temple de la Concentration',
      description: 'Améliorez votre focus dans un temple serein et minimaliste',
      duration: '25 min',
      category: 'focus',
      difficulty: 'avancé',
      environment: 'Temple zen',
      icon: '🏯',
      benefits: ['Focus intense', 'Productivité', 'Discipline mentale']
    },
    {
      id: '5',
      title: 'Jardin Stellaire',
      description: 'Contemplez les étoiles dans un jardin cosmique apaisant',
      duration: '18 min',
      category: 'relaxation',
      difficulty: 'intermédiaire',
      environment: 'Espace cosmique',
      icon: '🌌',
      benefits: ['Paix intérieure', 'Perspective', 'Sérénité']
    },
    {
      id: '6',
      title: 'Cascade Purifiante',
      description: 'Laissez-vous porter par l\'énergie purifiante d\'une cascade',
      duration: '12 min',
      category: 'nature',
      difficulty: 'débutant',
      environment: 'Cascade naturelle',
      icon: '💧',
      benefits: ['Purification mentale', 'Renouveau', 'Vitalité']
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes', icon: Globe },
    { id: 'relaxation', label: 'Relaxation', icon: Waves },
    { id: 'meditation', label: 'Méditation', icon: Brain },
    { id: 'nature', label: 'Nature', icon: Trees },
    { id: 'focus', label: 'Focus', icon: Eye },
    { id: 'energy', label: 'Énergie', icon: Zap }
  ];

  const filteredExperiences = selectedCategory === 'all' 
    ? vrExperiences 
    : vrExperiences.filter(exp => exp.category === selectedCategory);

  const startVRSession = (experience: VRExperience) => {
    setActiveExperience(experience);
    setIsInSession(true);
    setSessionProgress(0);
    
    // Simulation de la session VR
    const totalDuration = parseInt(experience.duration) * 60; // en secondes
    let elapsed = 0;
    
    const interval = setInterval(() => {
      elapsed += 1;
      const progress = (elapsed / totalDuration) * 100;
      setSessionProgress(progress);
      
      const remainingSeconds = totalDuration - elapsed;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      setSessionTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsInSession(false);
        setSessionProgress(0);
      }
    }, 1000);
  };

  const stopSession = () => {
    setIsInSession(false);
    setSessionProgress(0);
    setActiveExperience(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relaxation': return 'bg-blue-500';
      case 'meditation': return 'bg-purple-500';
      case 'nature': return 'bg-green-500';
      case 'focus': return 'bg-orange-500';
      case 'energy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-800';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Interface de session VR active
  if (isInSession && activeExperience) {
    return (
      <div data-testid="page-root" className="fixed inset-0 bg-black text-white flex flex-col">
        {/* Header de session */}
        <div className="p-6 bg-black/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{activeExperience.title}</h1>
              <p className="text-gray-300">{activeExperience.environment}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-mono">{sessionTimeRemaining}</div>
                <div className="text-sm text-gray-400">Temps restant</div>
              </div>
              <Button onClick={stopSession} variant="destructive">
                Arrêter la session
              </Button>
            </div>
          </div>
          <Progress value={sessionProgress} className="mt-4" />
        </div>

        {/* Zone d'immersion VR */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-bounce">{activeExperience.icon}</div>
                <h2 className="text-4xl font-bold mb-2">Session VR Active</h2>
                <p className="text-xl text-gray-300 mb-6">Immersion dans {activeExperience.environment}</p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span>Relaxation profonde</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span>Méditation guidée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contrôles flottants */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Headphones className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/b2c/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expériences VR</h1>
              <p className="text-gray-600">Immersion thérapeutique en réalité virtuelle</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Casque Connecté
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres VR
            </Button>
          </div>
        </div>

        {/* Statistiques VR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-gray-600">Sessions complétées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">6h 15min</div>
              <div className="text-sm text-gray-600">Temps total immersion</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Score de relaxation</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Relaxation</div>
              <div className="text-sm text-gray-600">Catégorie favorite</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres par catégorie */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Catégories d'expériences</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Liste des expériences VR */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Expériences disponibles ({filteredExperiences.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="cursor-pointer hover:shadow-xl transition-all group">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{experience.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{experience.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{experience.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Durée:</span>
                      <div className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        <span className="font-medium">{experience.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge className={getCategoryColor(experience.category)}>
                        {experience.category}
                      </Badge>
                      <Badge className={getDifficultyColor(experience.difficulty)}>
                        {experience.difficulty}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Environnement:</span> {experience.environment}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-700 mb-2">Bénéfices:</div>
                    <div className="flex flex-wrap gap-1">
                      {experience.benefits.map((benefit, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startVRSession(experience)}
                    className="w-full group-hover:bg-primary/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer l'expérience
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section recommandations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Recommandations personnalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧘‍♀️</div>
                <div>
                  <h3 className="font-semibold mb-2">Basé sur votre dernier scan émotionnel</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Votre niveau de stress semble élevé aujourd'hui. Nous recommandons une session de relaxation.
                  </p>
                  <Button size="sm" onClick={() => {
                    const relaxationExp = vrExperiences.find(exp => exp.id === '1');
                    if (relaxationExp) startVRSession(relaxationExp);
                  }}>
                    Commencer la relaxation recommandée
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historique des sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Plage Tropicale Zen', date: 'Aujourd\'hui 14:30', duration: '15 min', rating: 5 },
                { title: 'Forêt Méditative', date: 'Hier 09:15', duration: '20 min', rating: 4 },
                { title: 'Montagne Énergisante', date: '2 jours', duration: '10 min', rating: 5 }
              ].map((session, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-gray-600">{session.date} • {session.duration}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CVRPage;