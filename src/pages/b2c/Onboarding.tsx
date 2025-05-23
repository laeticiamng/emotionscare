
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProgressBar } from '@/components/ui/progress-bar';

const B2COnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // États des formulaires
  const [firstName, setFirstName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: false,
    push: false,
  });
  
  // Liste des centres d'intérêt
  const interestOptions = [
    'Méditation', 'Relaxation', 'Gestion du stress',
    'Sommeil', 'Productivité', 'Bien-être', 'Développement personnel',
    'Respiration', 'Musique', 'Relations', 'Émotions'
  ];
  
  // Gérer les changements d'intérêts
  const handleInterestChange = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  // Aller à l'étape suivante
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };
  
  // Revenir à l'étape précédente
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Valider l'étape actuelle
  const validateStep = () => {
    switch (step) {
      case 1: // Étape de base
        return firstName.trim().length > 0;
      case 2: // Centres d'intérêt
        return interests.length > 0;
      case 3: // Objectifs
        return goal.trim().length > 0 && frequency;
      case 4: // Préférences
        return true;
      default:
        return false;
    }
  };
  
  // Finaliser l'onboarding
  const finishOnboarding = () => {
    // Simulation d'enregistrement des données
    setTimeout(() => {
      toast.success("Configuration terminée avec succès !");
      navigate('/b2c/dashboard');
    }, 1000);
  };
  
  // Rendre le contenu en fonction de l'étape
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Comment souhaitez-vous être appelé ?</Label>
              <Input 
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom ou pseudo"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label>Quels sont vos centres d'intérêt ?</Label>
            <p className="text-sm text-muted-foreground">Sélectionnez au moins un centre d'intérêt</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`interest-${interest}`} 
                    checked={interests.includes(interest)}
                    onCheckedChange={() => handleInterestChange(interest)}
                  />
                  <Label htmlFor={`interest-${interest}`} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Quel est votre objectif principal ?</Label>
              <Textarea 
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Je souhaite améliorer ma gestion du stress au quotidien..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>À quelle fréquence souhaitez-vous utiliser l'application ?</Label>
              <RadioGroup value={frequency || ""} onValueChange={setFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quotidien" id="freq-daily" />
                  <Label htmlFor="freq-daily">Quotidien</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hebdomadaire" id="freq-weekly" />
                  <Label htmlFor="freq-weekly">Plusieurs fois par semaine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="occasionnel" id="freq-occasional" />
                  <Label htmlFor="freq-occasional">Occasionnel</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Parlez-nous de vous (optionnel)</Label>
              <Textarea 
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Quelques mots sur vous..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Préférences de notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-notif"
                    checked={notificationPrefs.email}
                    onCheckedChange={(checked) => 
                      setNotificationPrefs(prev => ({ ...prev, email: !!checked }))
                    }
                  />
                  <Label htmlFor="email-notif" className="text-sm">Notifications par email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="push-notif"
                    checked={notificationPrefs.push}
                    onCheckedChange={(checked) => 
                      setNotificationPrefs(prev => ({ ...prev, push: !!checked }))
                    }
                  />
                  <Label htmlFor="push-notif" className="text-sm">Notifications push sur l'appareil</Label>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Personnaliser votre expérience</CardTitle>
          <CardDescription>
            Étape {step} sur {totalSteps} : {
              step === 1 ? "Informations de base" :
              step === 2 ? "Centres d'intérêt" :
              step === 3 ? "Objectifs" :
              "Préférences"
            }
          </CardDescription>
          <ProgressBar value={(step / totalSteps) * 100} />
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Retour
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!validateStep()}
          >
            {step < totalSteps ? "Continuer" : "Terminer"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2COnboarding;
