
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MessageSquare, 
  Target, 
  CheckCircle, 
  Clock,
  Star,
  Users,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FeedbackDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Données mockées
  const satisfactionData = [
    { date: '2024-01-01', score: 4.2 },
    { date: '2024-01-02', score: 4.3 },
    { date: '2024-01-03', score: 4.1 },
    { date: '2024-01-04', score: 4.4 },
    { date: '2024-01-05', score: 4.5 },
    { date: '2024-01-06', score: 4.6 },
    { date: '2024-01-07', score: 4.7 }
  ];

  const feedbackDistribution = [
    { name: 'Compliments', value: 45, color: '#10B981' },
    { name: 'Suggestions', value: 30, color: '#3B82F6' },
    { name: 'Bugs', value: 20, color: '#F59E0B' },
    { name: 'Fonctionnalités', value: 5, color: '#8B5CF6' }
  ];

  const recentFeedback = [
    {
      id: '1',
      type: 'compliment',
      title: 'Interface très intuitive',
      user: 'Sarah M.',
      rating: 5,
      module: 'dashboard',
      time: '2h'
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Améliorer les notifications',
      user: 'Pierre L.',
      rating: 4,
      module: 'notifications',
      time: '5h'
    },
    {
      id: '3',
      type: 'bug',
      title: 'Problème de synchronisation',
      user: 'Marie D.',
      rating: 2,
      module: 'sync',
      time: '1j'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliment': return '👏';
      case 'suggestion': return '💡';
      case 'bug': return '🐛';
      case 'feature_request': return '✨';
      default: return '📝';
    }
  };

  const getStatusColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tableau de bord Feedback</h2>
          <p className="text-muted-foreground">Suivi de la satisfaction et des améliorations</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">4.6</p>
                <p className="text-sm text-muted-foreground">Satisfaction moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">127</p>
                <p className="text-sm text-muted-foreground">Feedbacks reçus</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">23</p>
                <p className="text-sm text-muted-foreground">Améliorations suggérées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">18</p>
                <p className="text-sm text-muted-foreground">Améliorations implémentées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="feedback">Feedbacks récents</TabsTrigger>
          <TabsTrigger value="improvements">Améliorations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution de la satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution des feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des feedbacks</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={feedbackDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {feedbackDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {feedbackDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedbacks récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getTypeIcon(feedback.type)}</span>
                      <div>
                        <h4 className="font-medium">{feedback.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Par {feedback.user} • Module: {feedback.module} • Il y a {feedback.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${getStatusColor(feedback.rating)}`}>
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{feedback.rating}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Répondre
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Suggestions d'amélioration IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Optimiser les temps de chargement</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Basé sur 12 feedbacks mentionnant des lenteurs. Impact estimé: +15% satisfaction
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-blue-600">Haute priorité</Badge>
                        <Badge variant="outline">Performance</Badge>
                      </div>
                    </div>
                    <Button size="sm">
                      Implémenter
                    </Button>
                  </div>
                  <Progress value={75} className="mt-3" />
                  <p className="text-xs text-blue-600 mt-1">Confiance: 75%</p>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">Ajouter des raccourcis clavier</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Demandé par 8 utilisateurs power. Améliorerait l'efficacité de navigation
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-600">Moyenne priorité</Badge>
                        <Badge variant="outline">UX</Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Planifier
                    </Button>
                  </div>
                  <Progress value={60} className="mt-3" />
                  <p className="text-xs text-green-600 mt-1">Confiance: 60%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métriques qualité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>NPS Score</span>
                  <span className="font-bold text-green-600">+67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taux d'adoption des fonctionnalités</span>
                  <span className="font-bold">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fréquence des bugs signalés</span>
                  <span className="font-bold text-orange-600">2.3/mois</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taux de rétention</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions requises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">3 bugs critiques en attente</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">12 feedbacks sans réponse</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">5 améliorations prêtes à déployer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackDashboard;
