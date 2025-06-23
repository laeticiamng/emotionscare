
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Star, TrendingUp, MessageSquare, Download, Lightbulb, Target, BarChart3, Users } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const {
    feedbacks,
    suggestions,
    metrics,
    submitFeedback,
    generateImprovementReport,
    exportFeedbackData,
    getModuleRecommendations,
    loading
  } = useFeedback();

  const [feedbackForm, setFeedbackForm] = useState({
    module: '',
    rating: 5,
    comment: '',
    category: 'improvement' as 'bug' | 'feature' | 'improvement' | 'praise'
  });

  const [currentReport, setCurrentReport] = useState<string>('');

  const modules = [
    { value: 'scan', label: 'Scan Émotionnel' },
    { value: 'music', label: 'Thérapie Musicale' },
    { value: 'coach', label: 'Coach IA' },
    { value: 'journal', label: 'Journal Émotionnel' },
    { value: 'vr', label: 'Réalité Virtuelle' },
    { value: 'gamification', label: 'Gamification' },
    { value: 'socialCocon', label: 'Cocon Social' },
    { value: 'general', label: 'Application Générale' }
  ];

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackForm.module || !feedbackForm.comment.trim()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await submitFeedback(feedbackForm);
      toast.success('Feedback soumis avec succès ! Merci pour votre retour.');
      
      // Reset form
      setFeedbackForm({
        module: '',
        rating: 5,
        comment: '',
        category: 'improvement'
      });
    } catch (error) {
      toast.error('Erreur lors de la soumission du feedback');
    }
  };

  const generateReport = async () => {
    try {
      const report = await generateImprovementReport();
      setCurrentReport(report);
      toast.success('Rapport généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'improvement': return 'bg-yellow-100 text-yellow-800';
      case 'praise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Évaluation Continue & Amélioration
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Votre feedback nous aide à améliorer constamment l'expérience EmotionsCare. 
            Partagez vos retours et découvrez nos actions d'amélioration.
          </p>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.overallSatisfaction}/10</p>
                  <p className="text-sm text-gray-600">Satisfaction Globale</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.improvementScore}%</p>
                  <p className="text-sm text-gray-600">Score d'Amélioration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.userEngagement}%</p>
                  <p className="text-sm text-gray-600">Engagement Utilisateur</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.feedbackVolume}</p>
                  <p className="text-sm text-gray-600">Feedbacks Collectés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submit">Donner un Feedback</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Formulaire de feedback */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Partager votre feedback</span>
                </CardTitle>
                <CardDescription>
                  Votre retour est précieux pour améliorer l'expérience EmotionsCare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="module">Module concerné *</Label>
                      <Select 
                        value={feedbackForm.module} 
                        onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, module: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map(module => (
                            <SelectItem key={module.value} value={module.value}>
                              {module.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select 
                        value={feedbackForm.category} 
                        onValueChange={(value: any) => setFeedbackForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="improvement">Amélioration</SelectItem>
                          <SelectItem value="bug">Bug/Problème</SelectItem>
                          <SelectItem value="feature">Nouvelle Fonctionnalité</SelectItem>
                          <SelectItem value="praise">Compliment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Note de satisfaction: {feedbackForm.rating}/10</Label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                        <Button
                          key={star}
                          type="button"
                          variant={feedbackForm.rating >= star ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                          className="h-8 w-8 p-0"
                        >
                          {star}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Votre commentaire *</Label>
                    <Textarea
                      id="comment"
                      placeholder="Décrivez votre expérience, suggestions d'amélioration, ou tout autre retour..."
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Envoi en cours...' : 'Envoyer le feedback'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions IA */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suggestions.slice(0, 6).map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suggestion.module}</CardTitle>
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{suggestion.suggestion}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impact prévu</span>
                        <span>{suggestion.impact}/10</span>
                      </div>
                      <Progress value={suggestion.impact * 10} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Temps d'implémentation: {suggestion.implementationTime}</span>
                      <Badge variant="outline">{suggestion.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Historique des feedbacks */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {feedbacks.slice(0, 10).map((feedback) => (
                <Card key={feedback.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{modules.find(m => m.value === feedback.module)?.label}</h3>
                          <Badge className={getCategoryColor(feedback.category)}>
                            {feedback.category}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{feedback.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{feedback.comment}</p>
                        {feedback.aiSuggestion && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <Lightbulb className="h-4 w-4 inline mr-1" />
                              Suggestion IA: {feedback.aiSuggestion}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 ml-4">
                        {new Date(feedback.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics et rapports */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notes par Module</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(metrics.moduleRatings).map(([module, rating]) => (
                    <div key={module} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="capitalize">{module}</span>
                        <span>{rating}/10</span>
                      </div>
                      <Progress value={rating * 10} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions d'Amélioration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button onClick={generateReport} disabled={loading} className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Générer Rapport d'Amélioration
                    </Button>
                    <Button onClick={exportFeedbackData} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les Données
                    </Button>
                  </div>
                  
                  {currentReport && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">{currentReport}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;
