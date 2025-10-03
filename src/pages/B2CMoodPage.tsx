import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Meh, Frown, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function B2CMoodPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { value: 'great', label: 'Très bien', icon: Smile, color: 'text-green-600' },
    { value: 'good', label: 'Bien', icon: Smile, color: 'text-blue-600' },
    { value: 'okay', label: 'Correct', icon: Meh, color: 'text-yellow-600' },
    { value: 'bad', label: 'Pas bien', icon: Frown, color: 'text-orange-600' },
    { value: 'terrible', label: 'Très mal', icon: Frown, color: 'text-red-600' },
  ];

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast({
        title: 'Sélection requise',
        description: 'Veuillez sélectionner votre humeur',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Humeur enregistrée',
      description: 'Votre humeur a été sauvegardée avec succès',
    });

    // TODO: Sauvegarder dans la base de données
    navigate('/app/particulier');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Suivi d'humeur</h1>
              <p className="text-muted-foreground">
                Comment vous sentez-vous aujourd'hui ?
              </p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Sélectionnez votre humeur</CardTitle>
            <CardDescription>
              Suivez votre humeur quotidienne pour mieux comprendre vos émotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                      selectedMood === mood.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${mood.color}`} />
                    <span className="text-lg font-medium">{mood.label}</span>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleSaveMood}
              disabled={!selectedMood}
              className="w-full"
              size="lg"
            >
              Enregistrer mon humeur
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground py-8">
              Pas encore d'historique d'humeur
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
