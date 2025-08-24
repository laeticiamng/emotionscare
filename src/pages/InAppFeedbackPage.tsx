import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Send, ThumbsUp, Bug, Lightbulb, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InAppFeedbackPage: React.FC = () => {
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    {
      id: 'suggestion',
      name: 'Suggestion d\'amélioration',
      icon: Lightbulb,
      color: 'text-yellow-600'
    },
    {
      id: 'bug',
      name: 'Signaler un bug',
      icon: Bug,
      color: 'text-red-600'
    },
    {
      id: 'compliment',
      name: 'Compliment',
      icon: ThumbsUp,
      color: 'text-green-600'
    },
    {
      id: 'feature',
      name: 'Nouvelle fonctionnalité',
      icon: Heart,
      color: 'text-pink-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !category || !feedback.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulation de l'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Feedback envoyé !",
        description: "Merci pour votre retour, il nous aide à améliorer EmotionsCare",
      });
      
      // Reset form
      setRating('');
      setCategory('');
      setFeedback('');
    }, 1500);
  };

  const StarRating = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star.toString())}
          className={`p-1 transition-colors ${
            parseInt(value) >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feedback In-App</h1>
          <p className="text-muted-foreground">
            Votre avis nous aide à améliorer continuellement EmotionsCare
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évaluation générale</CardTitle>
              <CardDescription>
                Comment évaluez-vous votre expérience globale ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Note sur 5 étoiles *</Label>
                <StarRating value={rating} onChange={setRating} />
                {rating && (
                  <p className="text-sm text-muted-foreground">
                    {rating === '1' && 'Très insatisfait'}
                    {rating === '2' && 'Insatisfait'}
                    {rating === '3' && 'Neutre'}
                    {rating === '4' && 'Satisfait'}
                    {rating === '5' && 'Très satisfait'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Type de feedback</CardTitle>
              <CardDescription>
                Quelle est la nature de votre retour ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={category} onValueChange={setCategory}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Label
                        key={cat.id}
                        htmlFor={cat.id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                          category === cat.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                        }`}
                      >
                        <RadioGroupItem value={cat.id} id={cat.id} />
                        <Icon className={`h-5 w-5 ${cat.color}`} />
                        <span className="font-medium">{cat.name}</span>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Votre message</CardTitle>
              <CardDescription>
                Décrivez votre expérience ou vos suggestions en détail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="feedback">Message *</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Partagez vos commentaires, suggestions ou problèmes rencontrés..."
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {feedback.length}/1000 caractères
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Confidentialité</h3>
            <p className="text-sm text-muted-foreground">
              Votre feedback est anonyme et utilisé uniquement pour améliorer notre service. 
              Nous ne partageons pas vos données avec des tiers.
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!rating || !category || !feedback.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>Envoi en cours...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default InAppFeedbackPage;