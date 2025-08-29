import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, TrendingUp, Heart, Shield, Zap, Star, 
         Brain, Target, Trophy, RefreshCw, Flame, CheckCircle,
         AlertTriangle, Lightbulb, Users, Calendar, MessageSquare } from 'lucide-react';
import { usePageMetadata } from '@/hooks/usePageMetadata';

interface Challenge {
  id: string;
  title: string;
  description: string;
  date: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  category: 'work' | 'personal' | 'health' | 'relationships' | 'financial';
  status: 'active' | 'overcome' | 'learning' | 'resolved';
  lessons: string[];
  actions: string[];
  progress: number;
  impact: number;
  growth: number;
}

interface ResilienceMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  icon: React.ComponentType<any>;
}

interface RecoveryPlan {
  id: string;
  title: string;
  description: string;
  steps: RecoveryStep[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface RecoveryStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'mindset' | 'action' | 'reflection' | 'support';
}

const BounceBackPage: React.FC = () => {
  usePageMetadata('Bounce Back', 'Transformez vos défis en force et résilience', '/app/bounce-back', 'resilient');
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [resilienceMetrics, setResilienceMetrics] = useState<ResilienceMetric[]>([]);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([]);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: 'work',
    severity: 'moderate'
  });
  const [resilienceScore, setResilienceScore] = useState(78);
  const [weeklyGrowth, setWeeklyGrowth] = useState(12);

  useEffect(() => {
    loadChallenges();
    loadResilienceMetrics();
    loadRecoveryPlans();
  }, []);

  const loadChallenges = () => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Échec présentation importante',
        description: 'Ma présentation devant le comité directeur ne s\'est pas bien passée. Questions difficiles et feedback négatif.',
        date: new Date().toISOString(),
        severity: 'major',
        category: 'work',
        status: 'learning',
        lessons: ['Importance de la préparation', 'Gérer le stress en public', 'Accepter le feedback constructif'],
        actions: ['Cours de prise de parole', 'Practice avec collègues', 'Demander coaching'],
        progress: 45,
        impact: 7,
        growth: 6
      },
      {
        id: '2',
        title: 'Rupture relationnelle',
        description: 'Fin d\'une relation importante après 3 ans. Difficile à accepter et à comprendre.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'critical',
        category: 'relationships',
        status: 'overcome',
        lessons: ['Communication est clé', 'Importance de l\'espace personnel', 'Grandir de chaque expérience'],
        actions: ['Thérapie individuelle', 'Reconnexion avec amis', 'Nouveaux hobbies'],
        progress: 85,
        impact: 9,
        growth: 8
      },
      {
        id: '3',
        title: 'Stress financier temporaire',
        description: 'Dépenses imprévues importantes ce mois-ci. Budget serré et anxiété.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        severity: 'moderate',
        category: 'financial',
        status: 'active',
        lessons: ['Importance fonds d\'urgence', 'Planification financière'],
        actions: ['Revoir budget mensuel', 'Plan épargne d\'urgence', 'Réduire dépenses non-essentielles'],
        progress: 25,
        impact: 5,
        growth: 4
      }
    ];
    setChallenges(mockChallenges);
  };

  const loadResilienceMetrics = () => {
    const metrics: ResilienceMetric[] = [
      {
        name: 'Adaptabilité',
        value: 82,
        trend: 'up',
        description: 'Capacité à s\'adapter aux changements',
        icon: RefreshCw
      },
      {
        name: 'Optimisme',
        value: 75,
        trend: 'up',
        description: 'Vision positive de l\'avenir',
        icon: Star
      },
      {
        name: 'Contrôle émotionnel',
        value: 68,
        trend: 'stable',
        description: 'Gestion des émotions difficiles',
        icon: Heart
      },
      {
        name: 'Résolution de problèmes',
        value: 85,
        trend: 'up',
        description: 'Capacité à trouver des solutions',
        icon: Lightbulb
      },
      {
        name: 'Support social',
        value: 70,
        trend: 'down',
        description: 'Réseau de soutien et connexions',
        icon: Users
      }
    ];
    setResilienceMetrics(metrics);
  };

  const loadRecoveryPlans = () => {
    const plans: RecoveryPlan[] = [
      {
        id: '1',
        title: 'Rebond Professionnel',
        description: 'Transformer un échec professionnel en opportunité de croissance',
        duration: '2 semaines',
        difficulty: 'intermediate',
        category: 'work',
        steps: [
          {
            id: '1',
            title: 'Analyse objective',
            description: 'Examiner objectivement ce qui s\'est passé sans auto-jugement',
            completed: true,
            type: 'reflection'
          },
          {
            id: '2',
            title: 'Identifier les leçons',
            description: 'Extraire les apprentissages clés de cette expérience',
            completed: true,
            type: 'reflection'
          },
          {
            id: '3',
            title: 'Plan d\'amélioration',
            description: 'Créer un plan concret pour éviter les mêmes erreurs',
            completed: false,
            type: 'action'
          },
          {
            id: '4',
            title: 'Demander du feedback',
            description: 'Obtenir des perspectives externes constructives',
            completed: false,
            type: 'support'
          },
          {
            id: '5',
            title: 'Nouvelle opportunité',
            description: 'Appliquer les leçons dans une nouvelle situation',
            completed: false,
            type: 'action'
          }
        ]
      },
      {
        id: '2',
        title: 'Guérison Émotionnelle',
        description: 'Processus de guérison après une perte ou une déception personnelle',
        duration: '4 semaines',
        difficulty: 'advanced',
        category: 'personal',
        steps: [
          {
            id: '1',
            title: 'Accepter les émotions',
            description: 'Permettre à toutes les émotions d\'être ressenties sans résistance',
            completed: true,
            type: 'mindset'
          },
          {
            id: '2',
            title: 'Exprimer sainement',
            description: 'Trouver des moyens sains d\'exprimer la douleur (écriture, art, sport)',
            completed: true,
            type: 'action'
          },
          {
            id: '3',
            title: 'Chercher du soutien',
            description: 'Se connecter avec des amis, famille ou professionnels',
            completed: false,
            type: 'support'
          },
          {
            id: '4',
            title: 'Redéfinir l\'identité',
            description: 'Découvrir qui vous êtes maintenant, après cette expérience',
            completed: false,
            type: 'reflection'
          }
        ]
      }
    ];
    setRecoveryPlans(plans);
  };

  const getSeverityColor = (severity: Challenge['severity']) => {
    switch (severity) {
      case 'minor': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'major': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Challenge['status']) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'overcome': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'work': return Target;
      case 'personal': return Heart;
      case 'health': return Shield;
      case 'relationships': return Users;
      case 'financial': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const getStepTypeIcon = (type: RecoveryStep['type']) => {
    switch (type) {
      case 'mindset': return Brain;
      case 'action': return Zap;
      case 'reflection': return MessageSquare;
      case 'support': return Users;
      default: return CheckCircle;
    }
  };

  const addChallenge = () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) return;

    const challenge: Challenge = {
      id: Date.now().toString(),
      title: newChallenge.title,
      description: newChallenge.description,
      date: new Date().toISOString(),
      severity: newChallenge.severity as Challenge['severity'],
      category: newChallenge.category as Challenge['category'],
      status: 'active',
      lessons: [],
      actions: [],
      progress: 0,
      impact: 0,
      growth: 0
    };

    setChallenges(prev => [challenge, ...prev]);
    setNewChallenge({ title: '', description: '', category: 'work', severity: 'moderate' });
  };

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId ? { ...c, progress } : c
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const activeChallenges = challenges.filter(c => c.status === 'active').length;
  const overcomeChallenges = challenges.filter(c => c.status === 'overcome').length;
  const averageGrowth = challenges.length > 0 ? 
    Math.round(challenges.reduce((sum, c) => sum + c.growth, 0) / challenges.length) : 0;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Bounce Back</h1>
              <p className="text-gray-600">Transformez vos défis en force et résilience</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{resilienceScore}</div>
              <div className="text-sm text-gray-600">Score de résilience</div>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">+{weeklyGrowth}%</span>
              <span className="text-sm text-green-600">cette semaine</span>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{activeChallenges}</div>
              <div className="text-sm text-gray-600">Défis actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{overcomeChallenges}</div>
              <div className="text-sm text-gray-600">Défis surmontés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{averageGrowth}</div>
              <div className="text-sm text-gray-600">Croissance moyenne</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{resilienceScore}</div>
              <div className="text-sm text-gray-600">Score de résilience</div>
            </CardContent>
          </Card>
        </div>

        {/* Interface avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="recovery">Plans de récupération</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Score de résilience */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Score de Résilience</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold">{resilienceScore}/100</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-5 h-5" />
                        <span>+{weeklyGrowth}% cette semaine</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={resilienceScore} className="w-32 mb-2" />
                    <Badge variant="secondary" className="text-green-600">
                      Résilience élevée
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Défis récents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Défis récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.slice(0, 3).map((challenge) => {
                    const CategoryIcon = getCategoryIcon(challenge.category);
                    
                    return (
                      <div key={challenge.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className={`p-2 rounded-lg ${getSeverityColor(challenge.severity)} text-white`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <Badge className={getStatusColor(challenge.status)}>
                              {challenge.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatDate(challenge.date)}</span>
                            <span>Progression: {challenge.progress}%</span>
                            <span>Croissance: +{challenge.growth}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {challenges.length > 3 && (
                  <div className="mt-4 text-center">
                    <Button onClick={() => setActiveTab('challenges')} variant="outline">
                      Voir tous les défis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Métriques de résilience */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques de résilience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resilienceMetrics.slice(0, 3).map((metric) => {
                    const IconComponent = metric.icon;
                    
                    return (
                      <div key={metric.name} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold">{metric.name}</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-600">{metric.value}%</span>
                            <div className={`flex items-center gap-1 ${
                              metric.trend === 'up' ? 'text-green-600' : 
                              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs">{metric.trend}</span>
                            </div>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                          <p className="text-xs text-gray-600">{metric.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {/* Ajouter un nouveau défi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Ajouter un nouveau défi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Titre du défi</label>
                    <input
                      type="text"
                      placeholder="Décrivez votre défi..."
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                    <select
                      value={newChallenge.category}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="work">Professionnel</option>
                      <option value="personal">Personnel</option>
                      <option value="health">Santé</option>
                      <option value="relationships">Relations</option>
                      <option value="financial">Financier</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Décrivez votre défi en détail..."
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Gravité</label>
                  <div className="flex gap-2">
                    {['minor', 'moderate', 'major', 'critical'].map((severity) => (
                      <Button
                        key={severity}
                        variant={newChallenge.severity === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewChallenge(prev => ({ ...prev, severity }))}
                        className="capitalize"
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={addChallenge} className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Ajouter le défi
                </Button>
              </CardContent>
            </Card>

            {/* Liste des défis */}
            <div className="space-y-4">
              {challenges.map((challenge) => {
                const CategoryIcon = getCategoryIcon(challenge.category);
                
                return (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getSeverityColor(challenge.severity)} text-white`}>
                          <CategoryIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{challenge.title}</h3>
                            <Badge className={getStatusColor(challenge.status)}>
                              {challenge.status}
                            </Badge>
                            <Badge className={getSeverityColor(challenge.severity)}>
                              {challenge.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{challenge.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-sm font-medium mb-1">Progression</div>
                              <Progress value={challenge.progress} className="mb-1" />
                              <div className="text-xs text-gray-500">{challenge.progress}% complété</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Impact émotionnel</div>
                              <div className="text-2xl font-bold text-red-600">{challenge.impact}/10</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Croissance personnelle</div>
                              <div className="text-2xl font-bold text-green-600">+{challenge.growth}</div>
                            </div>
                          </div>

                          {challenge.lessons.length > 0 && (
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2">Leçons apprises:</div>
                              <div className="flex flex-wrap gap-2">
                                {challenge.lessons.map((lesson, index) => (
                                  <Badge key={index} variant="secondary">
                                    {lesson}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {challenge.actions.length > 0 && (
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2">Actions prises:</div>
                              <div className="space-y-1">
                                {challenge.actions.map((action, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">{action}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(challenge.date)}
                            </div>
                            <div className="capitalize">{challenge.category}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-6">
            {/* Plans de récupération */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recoveryPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <Badge variant="outline">{plan.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {plan.duration}
                      </div>
                      <div className="capitalize">{plan.category}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-medium text-sm mb-2">Étapes du plan:</div>
                      {plan.steps.map((step) => {
                        const StepIcon = getStepTypeIcon(step.type);
                        
                        return (
                          <div key={step.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                            step.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}>
                            <div className={`p-1 rounded ${
                              step.completed ? 'bg-green-500' : 'bg-gray-400'
                            } text-white`}>
                              {step.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{step.title}</h4>
                              <p className="text-xs text-gray-600">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <Progress 
                        value={(plan.steps.filter(s => s.completed).length / plan.steps.length) * 100} 
                        className="mb-2" 
                      />
                      <div className="text-sm text-gray-600">
                        {plan.steps.filter(s => s.completed).length} / {plan.steps.length} étapes complétées
                      </div>
                    </div>

                    <Button className="w-full mt-4">
                      Commencer ce plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Métriques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resilienceMetrics.map((metric) => {
                const IconComponent = metric.icon;
                
                return (
                  <Card key={metric.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="w-5 h-5" />
                        {metric.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 mb-2">{metric.value}%</div>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                            metric.trend === 'up' ? 'bg-green-100 text-green-700' :
                            metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {metric.trend === 'up' ? 'En hausse' : 
                             metric.trend === 'down' ? 'En baisse' : 'Stable'}
                          </div>
                        </div>
                        
                        <Progress value={metric.value} className="h-3" />
                        
                        <p className="text-sm text-gray-600">{metric.description}</p>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          Améliorer cette métrique
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Graphique de progression */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la résilience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium mb-2">{day}</div>
                      <div className="h-20 bg-gray-100 rounded flex items-end justify-center p-1">
                        <div 
                          className="w-full bg-blue-500 rounded" 
                          style={{height: `${50 + index * 8}%`}}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{70 + index * 2}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600">
                  Score de résilience des 7 derniers jours
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Partage d'expériences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Communauté de soutien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: 'Sarah M.',
                      story: 'Après avoir perdu mon emploi, j\'ai utilisé cette période pour me reconvertir dans un domaine qui me passionne vraiment. Meilleure décision de ma vie !',
                      time: 'Il y a 2h',
                      likes: 24,
                      category: 'work'
                    },
                    {
                      user: 'Thomas L.',
                      story: 'Mon divorce a été difficile, mais j\'ai appris l\'importance de l\'auto-compassion et de prendre soin de soi. Je suis plus fort maintenant.',
                      time: 'Il y a 5h',
                      likes: 18,
                      category: 'relationships'
                    },
                    {
                      user: 'Marie K.',
                      story: 'Un accident de santé m\'a forcée à ralentir et repenser mes priorités. J\'ai découvert la méditation et une nouvelle philosophie de vie.',
                      time: 'Il y a 1 jour',
                      likes: 32,
                      category: 'health'
                    }
                  ].map((story, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                          {story.user[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{story.user}</span>
                            <Badge variant="outline" className="capitalize text-xs">
                              {story.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{story.story}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{story.time}</span>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{story.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Partagez votre histoire</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Inspirez les autres en partageant comment vous avez surmonté un défi
                  </p>
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Écrire mon histoire
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Groupes de soutien */}
            <Card>
              <CardHeader>
                <CardTitle>Groupes de soutien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Reconversion professionnelle', members: 234, category: 'work' },
                    { name: 'Ruptures et nouvelles relations', members: 156, category: 'relationships' },
                    { name: 'Santé et bien-être', members: 189, category: 'health' },
                    { name: 'Gestion financière', members: 98, category: 'financial' }
                  ].map((group, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold mb-1">{group.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{group.members} membres</span>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Rejoindre
                      </Button>
                    </div>
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

export default BounceBackPage;