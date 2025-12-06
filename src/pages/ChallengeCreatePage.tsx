import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChallengeCreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    startDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Défi créé !',
      description: 'Votre défi a été créé avec succès.',
    });
    navigate('/app/challenges');
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/app/challenges')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <header>
          <h1 className="text-3xl font-bold">Créer un Défi</h1>
          <p className="text-muted-foreground">Lancez un nouveau défi communautaire</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Détails du Défi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du Défi *</Label>
                <Input
                  id="title"
                  placeholder="Ex: 7 Jours de Méditation"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le défi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (jours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="7"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Créer le Défi
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/app/challenges')} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
