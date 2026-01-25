import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  Settings,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface RecommendationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: {
    emotionalState?: string[];
    stressLevel?: [number, number];
    timeOfDay?: string[];
    userType?: string[];
    activityHistory?: string;
  };
  recommendations: {
    type: 'exercise' | 'music' | 'vr' | 'coach' | 'journal';
    content: string[];
    duration?: number;
    intensity?: 'low' | 'medium' | 'high';
  };
  metrics: {
    triggers: number;
    successRate: number;
    avgRating: number;
  };
}

interface PersonalizationVector {
  userId: string;
  userName: string;
  preferences: {
    exerciseTypes: string[];
    musicGenres: string[];
    vrExperiences: string[];
    coachingStyle: string;
    sessionDuration: number;
  };
  behaviorData: {
    loginFrequency: number;
    avgSessionDuration: number;
    preferredTimes: string[];
    completionRate: number;
  };
  emotionalProfile: {
    dominantEmotions: string[];
    stressPatterns: string[];
    responsiveToTypes: string[];
  };
}

const mockRules: RecommendationRule[] = [
  {
    id: '1',
    name: 'Détection Stress Élevé',
    description: 'Recommande des exercices de relaxation quand le stress dépasse 7/10',
    enabled: true,
    priority: 1,
    conditions: {
      stressLevel: [7, 10],
      timeOfDay: ['morning', 'afternoon', 'evening']
    },
    recommendations: {
      type: 'exercise',
      content: ['Respiration profonde', 'Méditation guidée', 'Relaxation musculaire'],
      duration: 10,
      intensity: 'low'
    },
    metrics: {
      triggers: 1247,
      successRate: 87,
      avgRating: 4.3
    }
  },
  {
    id: '2',
    name: 'Boost Matinal',
    description: 'Musique énergisante pour commencer la journée positivement',
    enabled: true,
    priority: 2,
    conditions: {
      timeOfDay: ['morning'],
      emotionalState: ['neutral', 'slightly_positive']
    },
    recommendations: {
      type: 'music',
      content: ['Playlist Éveil', 'Sons Naturels Dynamiques', 'Musique Classique Stimulante'],
      duration: 15,
      intensity: 'medium'
    },
    metrics: {
      triggers: 892,
      successRate: 92,
      avgRating: 4.7
    }
  }
];

export default function RecommendationEngineAdminPage() {
  const [rules, setRules] = useState<RecommendationRule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<RecommendationRule | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [testUserId, setTestUserId] = useState('');

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    toast.success('Règle mise à jour');
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    // Simulation d'entraînement du modèle IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsTraining(false);
    toast.success('Modèle d\'IA réentraîné avec succès');
  };

  const testRecommendations = () => {
    if (!testUserId.trim()) {
      toast.error('Veuillez saisir un ID utilisateur');
      return;
    }
    
    toast.success(`Test des recommandations lancé pour l'utilisateur ${testUserId}`);
  };

  const createNewRule = () => {
    if (!newRuleName.trim()) {
      toast.error('Veuillez saisir un nom pour la règle');
      return;
    }

    const newRule: RecommendationRule = {
      id: Date.now().toString(),
      name: newRuleName,
      description: 'Nouvelle règle de recommandation',
      enabled: true,
      priority: rules.length + 1,
      conditions: {},
      recommendations: {
        type: 'exercise',
        content: [],
        intensity: 'medium'
      },
      metrics: {
        triggers: 0,
        successRate: 0,
        avgRating: 0
      }
    };

    setRules(prev => [...prev, newRule]);
    setNewRuleName('');
    toast.success('Nouvelle règle créée');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Moteur de Recommandations IA
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Configurez et optimisez les recommandations personnalisées basées sur l'IA pour améliorer l'expérience utilisateur.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-max grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="rules">Règles</TabsTrigger>
            <TabsTrigger value="personalization">Personnalisation</TabsTrigger>
            <TabsTrigger value="testing">Tests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommandations Actives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {rules.filter(r => r.enabled).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sur {rules.length} règles total
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Taux de Succès Moyen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(rules.reduce((acc, rule) => acc + rule.metrics.successRate, 0) / rules.length)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Basé sur {rules.reduce((acc, rule) => acc + rule.metrics.triggers, 0)} déclenchements
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Utilisateurs Touchés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,247</div>
                  <div className="text-xs text-muted-foreground">
                    Ce mois
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Dernière MAJ Modèle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2h</div>
                  <div className="text-xs text-muted-foreground">
                    Il y a 2 heures
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleTrainModel}
                    disabled={isTraining}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isTraining ? 'animate-spin' : ''}`} />
                    {isTraining ? 'Entraînement...' : 'Réentraîner le Modèle'}
                  </Button>
                  
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer Rapport
                  </Button>
                  
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres IA
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Top règles performantes */}
            <Card>
              <CardHeader>
                <CardTitle>Règles les Plus Performantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules
                    .sort((a, b) => b.metrics.successRate - a.metrics.successRate)
                    .slice(0, 5)
                    .map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{rule.name}</span>
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {rule.metrics.successRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rule.metrics.triggers} déclenchements
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des règles */}
          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer une Nouvelle Règle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Nom de la règle"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                  />
                  <Button onClick={createNewRule}>
                    Créer la Règle
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Règles de Recommandation</CardTitle>
                <CardDescription>
                  Gérez les règles qui déterminent les recommandations personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge variant="outline">Priorité {rule.priority}</Badge>
                            <Badge variant={rule.recommendations.type === 'exercise' ? 'default' : 'secondary'}>
                              {rule.recommendations.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Déclenchements:</span> {rule.metrics.triggers}
                            </div>
                            <div>
                              <span className="font-medium">Succès:</span> 
                              <span className="text-green-600 ml-1">{rule.metrics.successRate}%</span>
                            </div>
                            <div>
                              <span className="font-medium">Note:</span> 
                              <span className="ml-1">{rule.metrics.avgRating}/5</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRule(rule)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Conditions */}
                      <div className="border-t pt-3">
                        <h5 className="font-medium text-sm mb-2">Conditions:</h5>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.stressLevel && (
                            <Badge variant="outline">
                              Stress {rule.conditions.stressLevel[0]}-{rule.conditions.stressLevel[1]}/10
                            </Badge>
                          )}
                          {rule.conditions.timeOfDay?.map(time => (
                            <Badge key={time} variant="outline">
                              {time}
                            </Badge>
                          ))}
                          {rule.conditions.emotionalState?.map(emotion => (
                            <Badge key={emotion} variant="outline">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personnalisation */}
          <TabsContent value="personalization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vecteurs de Personnalisation</CardTitle>
                <CardDescription>
                  Analysez les profils utilisateurs pour optimiser les recommandations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Facteurs de Personnalisation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Historique émotionnel</span>
                        <Badge>Poids: 0.35</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Préférences utilisateur</span>
                        <Badge>Poids: 0.25</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Heure d'utilisation</span>
                        <Badge>Poids: 0.20</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Taux de complétion</span>
                        <Badge>Poids: 0.15</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Feedback utilisateur</span>
                        <Badge>Poids: 0.05</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Types de Recommandations</h4>
                    <div className="space-y-2">
                      {[
                        { type: 'Exercices de respiration', usage: '67%' },
                        { type: 'Musique thérapeutique', usage: '54%' },
                        { type: 'Sessions VR', usage: '32%' },
                        { type: 'Coaching personnalisé', usage: '78%' },
                        { type: 'Journal guidé', usage: '45%' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.type}</span>
                          <span className="text-sm font-medium">{item.usage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segments utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle>Segments Utilisateurs Identifiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Stressés Chroniques',
                      size: '23%',
                      characteristics: ['Stress élevé constant', 'Préfère relaxation', 'Utilisation soir'],
                      recommendations: ['Méditation', 'Musique apaisante', 'Exercices courts']
                    },
                    {
                      name: 'Optimiseurs Matinaux',
                      size: '31%',
                      characteristics: ['Proactifs', 'Matin préféré', 'Complétion élevée'],
                      recommendations: ['Coaching énergisant', 'Musique stimulante', 'Objectifs quotidiens']
                    },
                    {
                      name: 'Explorateurs VR',
                      size: '18%',
                      characteristics: ['Tech-savvy', 'Expériences immersives', 'Sessions longues'],
                      recommendations: ['VR relaxation', 'Environnements naturels', 'Biofeedback']
                    }
                  ].map((segment, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{segment.name}</CardTitle>
                        <CardDescription>{segment.size} des utilisateurs</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Caractéristiques:</h5>
                          <ul className="text-xs space-y-1">
                            {segment.characteristics.map((char, i) => (
                              <li key={i}>• {char}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Recommandations efficaces:</h5>
                          <div className="flex flex-wrap gap-1">
                            {segment.recommendations.map((rec, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {rec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test des Recommandations</CardTitle>
                <CardDescription>
                  Testez les recommandations pour un utilisateur spécifique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="ID utilisateur (ex: user_123)"
                    value={testUserId}
                    onChange={(e) => setTestUserId(e.target.value)}
                  />
                  <Button onClick={testRecommendations}>
                    <Zap className="h-4 w-4 mr-2" />
                    Tester
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>A/B Tests en Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Recommandations Proactives vs Réactives',
                      status: 'En cours',
                      participants: 1247,
                      confidence: 85,
                      winner: 'Proactives (+12% engagement)'
                    },
                    {
                      name: 'Fréquence des Notifications',
                      status: 'En cours',
                      participants: 892,
                      confidence: 73,
                      winner: 'Non déterminé'
                    }
                  ].map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{test.name}</h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            {test.participants} participants • Confiance: {test.confidence}%
                          </div>
                        </div>
                        <Badge variant={test.status === 'En cours' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                      {test.winner !== 'Non déterminé' && (
                        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                          <CheckCircle className="h-4 w-4 inline mr-2" />
                          Gagnant: {test.winner}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Exercices', success: 89, triggers: 2456 },
                      { type: 'Musique', success: 92, triggers: 1789 },
                      { type: 'VR', success: 78, triggers: 567 },
                      { type: 'Coach', success: 85, triggers: 1234 },
                      { type: 'Journal', success: 76, triggers: 890 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.type}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${item.success}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{item.success}%</span>
                          <span className="text-xs text-muted-foreground w-16">
                            {item.triggers} fois
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances Temporelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: 'Matin (6h-12h)', engagement: 78, preferences: 'Énergisant, Coaching' },
                      { time: 'Après-midi (12h-18h)', engagement: 65, preferences: 'Concentration, Musique' },
                      { time: 'Soir (18h-24h)', engagement: 89, preferences: 'Relaxation, VR' },
                      { time: 'Nuit (0h-6h)', engagement: 34, preferences: 'Sommeil, Ambiance' }
                    ].map((item, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{item.time}</span>
                          <Badge variant="outline">{item.engagement}% engagement</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Préférences: {item.preferences}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métriques Globales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-muted-foreground">Précision Globale</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.3/5</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Moyenne</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">23min</div>
                    <div className="text-sm text-muted-foreground">Temps de Session Moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">67%</div>
                    <div className="text-sm text-muted-foreground">Taux de Complétion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}