
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Star, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb, 
  Bug, 
  Heart,
  TrendingUp,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FeedbackItem {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'compliment';
  title: string;
  description: string;
  rating: number;
  status: 'new' | 'in-progress' | 'resolved';
  date: string;
  upvotes: number;
}

const FeedbackPage: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const { toast } = useToast();

  const recentFeedback: FeedbackItem[] = [
    {
      id: '1',
      type: 'feature',
      title: 'Notifications personnalisées',
      description: 'Possibilité de personnaliser les horaires de notification',
      rating: 4,
      status: 'in-progress',
      date: '2024-01-10',
      upvotes: 12
    },
    {
      id: '2',
      type: 'improvement',
      title: 'Interface plus intuitive',
      description: 'Simplifier la navigation dans les paramètres',
      rating: 5,
      status: 'resolved',
      date: '2024-01-08',
      upvotes: 8
    },
    {
      id: '3',
      type: 'bug',
      title: 'Problème de synchronisation',
      description: 'Les données ne se synchronisent pas toujours',
      rating: 3,
      status: 'new',
      date: '2024-01-12',
      upvotes: 5
    }
  ];

  const handleSubmitFeedback = () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le titre et la description.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback envoyé !",
      description: "Merci pour votre retour. Nous l'examinerons rapidement.",
    });

    // Reset form
    setTitle('');
    setDescription('');
    setEmail('');
    setRating(5);
    setFeedbackType('general');
    setAnonymous(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'compliment':
        return <Heart className="h-4 w-4 text-pink-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Centre de Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Votre avis nous aide à améliorer EmotionsCare
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">247</div>
              <div className="text-sm text-muted-foreground">Retours reçus</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">Problèmes résolus</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">2.3j</div>
              <div className="text-sm text-muted-foreground">Temps de réponse moyen</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="text-sm text-muted-foreground">Satisfaction moyenne</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Nouveau Feedback</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Partagez votre expérience
                </CardTitle>
                <CardDescription>
                  Votre feedback nous aide à améliorer la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type de feedback */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Type de feedback</Label>
                  <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general">Commentaire général</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug">Signaler un problème</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feature" id="feature" />
                      <Label htmlFor="feature">Demande de fonctionnalité</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="improvement" id="improvement" />
                      <Label htmlFor="improvement">Suggestion d'amélioration</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Évaluation */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Évaluation globale</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {rating}/5 étoiles
                    </span>
                  </div>
                </div>

                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    placeholder="Résumez votre feedback en quelques mots"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description détaillée
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre expérience, problème ou suggestion..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Email (optionnel) */}
                {!anonymous && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email (optionnel)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Pour vous tenir informé du suivi de votre feedback
                    </p>
                  </div>
                )}

                {/* Anonymat */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={anonymous}
                    onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Envoyer ce feedback de manière anonyme
                  </Label>
                </div>

                <Button onClick={handleSubmitFeedback} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Feedback récent de la communauté</h3>
              
              {recentFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(item.type)}
                          <div>
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'new' && 'Nouveau'}
                          {item.status === 'in-progress' && 'En cours'}
                          {item.status === 'resolved' && 'Résolu'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {item.upvotes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedbackPage;
