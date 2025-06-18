
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  CheckCircle2,
  Clock,
  Lightbulb,
  Users,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  category: 'ui' | 'performance' | 'feature' | 'workflow';
  affected_users: number;
  expected_benefit: string;
  implementation_time: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
}

const ImprovementEngine: React.FC = () => {
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Données mockées pour la démo
  const mockSuggestions: ImprovementSuggestion[] = [
    {
      id: '1',
      title: 'Optimisation des animations de transition',
      description: 'Réduire la durée des animations pour améliorer la perception de fluidité',
      impact: 'medium',
      effort: 'low',
      confidence: 87,
      category: 'performance',
      affected_users: 1250,
      expected_benefit: '+12% satisfaction utilisateur',
      implementation_time: '2-3 jours',
      status: 'pending'
    },
    {
      id: '2', 
      title: 'Raccourcis clavier avancés',
      description: 'Ajouter des raccourcis pour les actions fréquentes identifiées dans les analytics',
      impact: 'high',
      effort: 'medium',
      confidence: 92,
      category: 'workflow',
      affected_users: 890,
      expected_benefit: '+25% efficacité',
      implementation_time: '1-2 semaines',
      status: 'approved'
    },
    {
      id: '3',
      title: 'Mode sombre amélioré',
      description: 'Peaufiner les contrastes et la lisibilité en mode sombre',
      impact: 'medium',
      effort: 'low',
      confidence: 78,
      category: 'ui',
      affected_users: 2100,
      expected_benefit: '+18% satisfaction',
      implementation_time: '3-4 jours',
      status: 'in_progress'
    },
    {
      id: '4',
      title: 'Suggestions contextuelles IA',
      description: 'Intégrer des suggestions intelligentes basées sur le comportement utilisateur',
      impact: 'high',
      effort: 'high',
      confidence: 85,
      category: 'feature',
      affected_users: 3200,
      expected_benefit: '+30% engagement',
      implementation_time: '3-4 semaines',
      status: 'pending'
    }
  ];

  useEffect(() => {
    setSuggestions(mockSuggestions);
  }, []);

  const generateNewSuggestions = async () => {
    setIsGenerating(true);
    try {
      // Simulation de génération IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Nouvelles suggestions générées avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  };

  const approveSuggestion = (id: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, status: 'approved' } : s)
    );
    toast.success('Suggestion approuvée !');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ui': return <Target className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'feature': return <Sparkles className="h-4 w-4" />;
      case 'workflow': return <Users className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500';
      case 'approved': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Moteur d'amélioration IA
          </h2>
          <p className="text-muted-foreground">
            Suggestions intelligentes basées sur l'analyse des feedbacks utilisateur
          </p>
        </div>
        <Button 
          onClick={generateNewSuggestions}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Génération...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Générer nouvelles suggestions
            </div>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{suggestions.length}</p>
                <p className="text-sm text-muted-foreground">Suggestions actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {suggestions.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Implémentées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Confiance moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {suggestions.reduce((acc, s) => acc + s.affected_users, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Utilisateurs impactés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Toutes
            </Button>
            {['ui', 'performance', 'feature', 'workflow'].map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Liste des suggestions */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(suggestion.category)}
                              <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                            </div>
                            <Badge className={getStatusColor(suggestion.status)}>
                              {suggestion.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-4">
                            {suggestion.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Impact</p>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getImpactColor(suggestion.impact)}`} />
                                <span className="capitalize text-sm">{suggestion.impact}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium">Effort</p>
                              <span className={`text-sm capitalize ${getEffortColor(suggestion.effort)}`}>
                                {suggestion.effort}
                              </span>
                            </div>

                            <div>
                              <p className="text-sm font-medium">Confiance</p>
                              <div className="flex items-center gap-2">
                                <Progress value={suggestion.confidence} className="w-16 h-2" />
                                <span className="text-sm font-medium">{suggestion.confidence}%</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium">Utilisateurs</p>
                              <span className="text-sm font-medium">
                                {suggestion.affected_users.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {suggestion.expected_benefit}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {suggestion.implementation_time}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {suggestion.status === 'pending' && (
                            <Button
                              onClick={() => approveSuggestion(suggestion.id)}
                              size="sm"
                              className="bg-gradient-to-r from-green-600 to-emerald-600"
                            >
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Approuver
                              </div>
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Détails
                            <ArrowRight className="h-4 w-4 ml-1" />
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

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics d'amélioration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+23%</p>
                    <p className="text-sm text-muted-foreground">Satisfaction après améliorations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-muted-foreground">Taux de succès des suggestions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">15j</p>
                    <p className="text-sm text-muted-foreground">Temps moyen d'implémentation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap des améliorations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {suggestions
                  .filter(s => s.status !== 'completed')
                  .sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.impact as keyof typeof priorityOrder] || 0) - 
                           (priorityOrder[a.impact as keyof typeof priorityOrder] || 0);
                  })
                  .map((suggestion, index) => (
                    <div key={suggestion.id} className="flex items-center gap-4">
                      <div className="text-sm font-medium text-muted-foreground w-8">
                        Q{Math.floor(index / 3) + 1}
                      </div>
                      <div className="flex-1 p-3 border rounded-lg">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.implementation_time}</p>
                      </div>
                      <Badge className={getStatusColor(suggestion.status)}>
                        {suggestion.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImprovementEngine;
