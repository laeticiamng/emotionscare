
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Users, Music, Eye, Gamepad2 } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    experience: '',
    interests: [] as string[],
    goals: [] as string[],
    notifications: true
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finaliser l'onboarding
      navigate('/b2c/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Bienvenue sur EmotionsCare</h2>
              <p className="text-muted-foreground">Commençons par faire connaissance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medecin">Médecin</SelectItem>
                  <SelectItem value="infirmier">Infirmier/ère</SelectItem>
                  <SelectItem value="psychologue">Psychologue</SelectItem>
                  <SelectItem value="aide-soignant">Aide-soignant</SelectItem>
                  <SelectItem value="autre">Autre professionnel de santé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Brain className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Vos centres d'intérêt</h2>
              <p className="text-muted-foreground">Sélectionnez ce qui vous intéresse le plus</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'scan', label: 'Analyse émotionnelle', icon: Eye },
                { id: 'music', label: 'Musicothérapie', icon: Music },
                { id: 'vr', label: 'Réalité virtuelle', icon: Brain },
                { id: 'games', label: 'Jeux thérapeutiques', icon: Gamepad2 },
                { id: 'social', label: 'Communauté', icon: Users },
                { id: 'meditation', label: 'Méditation', icon: Heart }
              ].map((interest) => (
                <Card
                  key={interest.id}
                  className={`cursor-pointer transition-colors ${
                    formData.interests.includes(interest.id) ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  <CardContent className="p-4 text-center">
                    <interest.icon className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">{interest.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Vos objectifs</h2>
              <p className="text-muted-foreground">Que souhaitez-vous améliorer ?</p>
            </div>
            <div className="space-y-3">
              {[
                'Réduire le stress au travail',
                'Améliorer mon bien-être émotionnel',
                'Développer ma résilience',
                'Mieux gérer mes émotions',
                'Prendre soin de ma santé mentale',
                'Créer des liens avec mes collègues'
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                  />
                  <Label htmlFor={goal} className="text-sm font-medium">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Gamepad2 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Derniers détails</h2>
              <p className="text-muted-foreground">Configurons vos préférences</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked as boolean }))}
                />
                <Label htmlFor="notifications">
                  Recevoir des notifications de bien-être
                </Label>
              </div>
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Récapitulatif de votre profil</h3>
                  <ul className="text-sm space-y-1">
                    <li><strong>Nom :</strong> {formData.firstName} {formData.lastName}</li>
                    <li><strong>Profession :</strong> {formData.profession}</li>
                    <li><strong>Intérêts :</strong> {formData.interests.length} sélectionnés</li>
                    <li><strong>Objectifs :</strong> {formData.goals.length} définis</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Étape {currentStep} sur {totalSteps}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
