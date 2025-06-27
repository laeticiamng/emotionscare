
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Send, MessageSquare, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Merci pour votre retour ! Nous l\'étudierons attentivement.');
    setRating(0);
    setFeedback('');
    setEmail('');
    setCategory('general');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Vos Retours Comptent</h1>
        <p className="text-xl text-muted-foreground">
          Aidez-nous à améliorer EmotionsCare avec vos suggestions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback Général
            </CardTitle>
            <CardDescription>
              Partagez votre expérience et vos suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Évaluation globale</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <RadioGroup value={category} onValueChange={setCategory} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">Général</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Bug / Problème</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature">Nouvelle fonctionnalité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ui" id="ui" />
                    <Label htmlFor="ui">Interface utilisateur</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="feedback">Votre message</Label>
                <Textarea
                  id="feedback"
                  placeholder="Décrivez votre expérience, vos suggestions ou les problèmes rencontrés..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Suggestions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Améliorer la vitesse de chargement',
                  'Ajouter plus d\'exercices de respiration',
                  'Interface plus intuitive',
                  'Mode sombre automatique',
                  'Notifications personnalisables',
                  'Export des données'
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => setFeedback(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nous Contacter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email :</strong> support@emotionscare.com</p>
                <p><strong>Délai de réponse :</strong> 24-48h</p>
                <p><strong>Disponibilité support :</strong> Lun-Ven 9h-18h</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
