
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, User, Settings, CheckCircle, Loader2 } from 'lucide-react';

interface OnboardingData {
  profession: string;
  goals: string[];
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    tips: boolean;
  };
}

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    profession: '',
    goals: [],
    preferences: {
      notifications: true,
      dataSharing: false,
      tips: true,
    },
  });

  const goals = [
    'Gérer le stress',
    'Améliorer le bien-être',
    'Suivre mes émotions',
    'Développer la résilience',
    'Équilibrer vie pro/perso',
    'Prévenir le burnout',
  ];

  const handleGoalToggle = (goal: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...data.preferences,
            profession: data.profession,
            goals: data.goals,
            onboarding_completed: true,
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Configuration terminée !');
      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <User className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Parlez-nous de vous</h2>
        <p className="text-muted-foreground">
          Ces informations nous aident à personnaliser votre expérience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="profession">Profession / Secteur d'activité</Label>
          <Input
            id="profession"
            value={data.profession}
            onChange={(e) => setData(prev => ({ ...prev, profession: e.target.value }))}
            placeholder="Ex: Infirmier, Enseignant, Manager..."
          />
        </div>
      </div>

      <Button onClick={() => setCurrentStep(2)} className="w-full">
        Continuer
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Vos objectifs</h2>
        <p className="text-muted-foreground">
          Sélectionnez ce qui vous intéresse le plus
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <div
            key={goal}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              data.goals.includes(goal)
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleGoalToggle(goal)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={data.goals.includes(goal)}
                onChange={() => {}}
              />
              <span className="text-sm">{goal}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          Retour
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="flex-1">
          Continuer
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Préférences</h2>
        <p className="text-muted-foreground">
          Configurez votre expérience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="notifications"
            checked={data.preferences.notifications}
            onCheckedChange={(checked) => 
              setData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, notifications: checked as boolean }
              }))
            }
          />
          <Label htmlFor="notifications">Recevoir des notifications de rappel</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tips"
            checked={data.preferences.tips}
            onCheckedChange={(checked) => 
              setData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, tips: checked as boolean }
              }))
            }
          />
          <Label htmlFor="tips">Recevoir des conseils personnalisés</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dataSharing"
            checked={data.preferences.dataSharing}
            onCheckedChange={(checked) => 
              setData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, dataSharing: checked as boolean }
              }))
            }
          />
          <Label htmlFor="dataSharing">Partager des données anonymisées pour la recherche</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          Retour
        </Button>
        <Button onClick={handleComplete} disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalisation...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminer
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configuration initiale</CardTitle>
            <span className="text-sm text-muted-foreground">{currentStep}/3</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
