import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Send, Heart, Lightbulb, Bug } from 'lucide-react';
import { LoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { toast } from 'sonner';

const B2CFeedbackPage: React.FC = () => {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingStates.Loading text="Chargement du formulaire..." />;
  if (loadingState === 'error') return <LoadingStates.Error message="Erreur de chargement" />;

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Veuillez rédiger votre message');
      return;
    }

    setIsSubmitting(true);
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Votre feedback a été envoyé avec succès !');
    setMessage('');
    setRating('');
    setFeatures([]);
    setIsSubmitting(false);
  };

  const handleFeatureToggle = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const feedbackTypes = [
    { value: 'suggestion', label: 'Suggestion d\'amélioration', icon: <Lightbulb className="h-4 w-4" />, color: 'text-yellow-500' },
    { value: 'bug', label: 'Signaler un problème', icon: <Bug className="h-4 w-4" />, color: 'text-red-500' },
    { value: 'compliment', label: 'Compliment', icon: <Heart className="h-4 w-4" />, color: 'text-pink-500' },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: <Star className="h-4 w-4" />, color: 'text-blue-500' }
  ];

  const availableFeatures = [
    'Scan Émotions',
    'Musique Thérapeutique', 
    'Coach IA',
    'Journal',
    'Réalité Virtuelle',
    'Bubble Beat',
    'Flash Glow',
    'Gamification',
    'Interface Utilisateur',
    'Performance'
  ];

  const recentFeedbacks = [
    { type: 'suggestion', message: 'Possibilité d\'ajouter des rappels personnalisés', status: 'En cours', date: '15 Jan' },
    { type: 'compliment', message: 'L\'interface est vraiment intuitive !', status: 'Merci', date: '12 Jan' },
    { type: 'feature', message: 'Mode sombre pour l\'application', status: 'Planifié', date: '10 Jan' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-muted-foreground">Votre avis nous aide à améliorer EmotionsCare</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de feedback */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Partagez votre expérience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type de feedback */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type de feedback</Label>
              <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label htmlFor={type.value} className={`flex items-center gap-2 cursor-pointer ${type.color}`}>
                        {type.icon}
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Évaluation générale */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Évaluation générale</Label>
              <RadioGroup value={rating} onValueChange={setRating}>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <div key={score} className="flex items-center space-x-2">
                      <RadioGroupItem value={score.toString()} id={`rating-${score}`} />
                      <Label htmlFor={`rating-${score}`} className="cursor-pointer">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: score }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-2 text-sm">{score}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Fonctionnalités concernées */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Fonctionnalités concernées (optionnel)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-base font-medium">
                Votre message *
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre expérience, suggestion ou problème en détail..."
                rows={6}
                className="resize-none"
              />
              <div className="text-sm text-muted-foreground">
                {message.length}/500 caractères
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim()}
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Feedback récents et infos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vos feedbacks récents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentFeedbacks.map((feedback, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {feedbackTypes.find(t => t.value === feedback.type)?.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{feedback.date}</span>
                  </div>
                  <p className="text-sm mb-2">{feedback.message}</p>
                  <Badge 
                    variant={
                      feedback.status === 'En cours' ? 'default' :
                      feedback.status === 'Planifié' ? 'secondary' :
                      'outline'
                    }
                    className="text-xs"
                  >
                    {feedback.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pourquoi votre avis compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                💡 <strong>Amélioration continue :</strong> Vos suggestions nous aident à développer de nouvelles fonctionnalités.
              </p>
              <p>
                🐛 <strong>Correction rapide :</strong> Signalez les problèmes pour une résolution rapide.
              </p>
              <p>
                ❤️ <strong>Motivation :</strong> Vos compliments motivent notre équipe à continuer d'innover.
              </p>
              <p>
                🚀 <strong>Priorisation :</strong> Vos retours nous aident à prioriser le développement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CFeedbackPage;