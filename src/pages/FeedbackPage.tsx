
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Lightbulb, Bug, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeedbackPage: React.FC = () => {
  const { toast } = useToast();
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'general',
    rating: '',
    title: '',
    description: '',
    email: '',
    category: '',
    urgency: 'medium'
  });

  const [suggestionForm, setSuggestionForm] = useState({
    title: '',
    description: '',
    category: 'feature',
    impact: 'medium',
    email: ''
  });

  const recentFeedback = [
    {
      id: '1',
      type: 'suggestion',
      title: 'Améliorer la navigation mobile',
      status: 'in-progress',
      votes: 23,
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'bug',
      title: 'Problème de synchronisation VR',
      status: 'resolved',
      votes: 8,
      date: '2024-01-14'
    },
    {
      id: '3',
      type: 'feature',
      title: 'Mode sombre pour l\'interface',
      status: 'planned',
      votes: 45,
      date: '2024-01-13'
    }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedbackForm);
    toast({
      title: "Merci pour votre retour !",
      description: "Votre feedback a été envoyé avec succès.",
    });
    setFeedbackForm({
      type: 'general',
      rating: '',
      title: '',
      description: '',
      email: '',
      category: '',
      urgency: 'medium'
    });
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Suggestion submitted:', suggestionForm);
    toast({
      title: "Suggestion envoyée !",
      description: "Merci pour votre idée, nous l'étudierons attentivement.",
    });
    setSuggestionForm({
      title: '',
      description: '',
      category: 'feature',
      impact: 'medium',
      email: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Résolu';
      case 'in-progress':
        return 'En cours';
      case 'planned':
        return 'Planifié';
      default:
        return 'Nouveau';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Feedback & Suggestions</h1>
          <p className="text-xl text-muted-foreground">
            Aidez-nous à améliorer EmotionsCare avec vos retours
          </p>
        </div>

        <Tabs defaultValue="feedback" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Communauté
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Partagez votre expérience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type de feedback</Label>
                      <Select 
                        value={feedbackForm.type} 
                        onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Général</SelectItem>
                          <SelectItem value="bug">Signaler un bug</SelectItem>
                          <SelectItem value="feature">Demande de fonctionnalité</SelectItem>
                          <SelectItem value="ui">Interface utilisateur</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select 
                        value={feedbackForm.category} 
                        onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scan">Scan émotionnel</SelectItem>
                          <SelectItem value="music">Musicothérapie</SelectItem>
                          <SelectItem value="vr">Réalité virtuelle</SelectItem>
                          <SelectItem value="coach">Coach IA</SelectItem>
                          <SelectItem value="dashboard">Tableau de bord</SelectItem>
                          <SelectItem value="mobile">Application mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Évaluation globale</Label>
                    <RadioGroup 
                      value={feedbackForm.rating} 
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, rating: value }))}
                      className="flex items-center space-x-6"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`} className="flex items-center cursor-pointer">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-2">{rating}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={feedbackForm.title}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Résumé de votre feedback"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description détaillée</Label>
                    <Textarea
                      value={feedbackForm.description}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre expérience, les problèmes rencontrés ou vos suggestions..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email (optionnel)</Label>
                      <Input
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Pour un suivi de votre feedback"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Urgence</Label>
                      <Select 
                        value={feedbackForm.urgency} 
                        onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, urgency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Envoyer le feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Proposez une amélioration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSuggestionSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Titre de la suggestion</Label>
                    <Input
                      value={suggestionForm.title}
                      onChange={(e) => setSuggestionForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Résumé de votre idée"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description détaillée</Label>
                    <Textarea
                      value={suggestionForm.description}
                      onChange={(e) => setSuggestionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Expliquez votre idée, comment elle améliorerait l'expérience utilisateur..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <Select 
                        value={suggestionForm.category} 
                        onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Nouvelle fonctionnalité</SelectItem>
                          <SelectItem value="improvement">Amélioration existante</SelectItem>
                          <SelectItem value="ui">Interface utilisateur</SelectItem>
                          <SelectItem value="integration">Intégration</SelectItem>
                          <SelectItem value="accessibility">Accessibilité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Impact estimé</Label>
                      <Select 
                        value={suggestionForm.impact} 
                        onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, impact: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyen</SelectItem>
                          <SelectItem value="high">Élevé</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email (optionnel)</Label>
                    <Input
                      type="email"
                      value={suggestionForm.email}
                      onChange={(e) => setSuggestionForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Pour vous tenir informé du statut"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Proposer la suggestion
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback récent de la communauté</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentFeedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.type === 'bug' && <Bug className="h-4 w-4 text-red-500" />}
                          {item.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-yellow-500" />}
                          {item.type === 'feature' && <Star className="h-4 w-4 text-blue-500" />}
                          <h3 className="font-semibold">{item.title}</h3>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {item.votes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques communautaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-muted-foreground">Suggestions soumises</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">43</div>
                      <div className="text-sm text-muted-foreground">Fonctionnalités ajoutées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">89</div>
                      <div className="text-sm text-muted-foreground">Bugs corrigés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">4.7</div>
                      <div className="text-sm text-muted-foreground">Note moyenne</div>
                    </div>
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

export default FeedbackPage;
