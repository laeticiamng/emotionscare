
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    frequency: '',
    notifications: true,
    preferences: [] as string[]
  });
  
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleMultiCheckboxChange = (value: string) => {
    const preferences = [...formData.preferences];
    const index = preferences.indexOf(value);
    
    if (index === -1) {
      preferences.push(value);
    } else {
      preferences.splice(index, 1);
    }
    
    setFormData({ ...formData, preferences });
  };
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const completeOnboarding = () => {
    // Save onboarding data
    console.log('Onboarding completed with data:', formData);
    
    toast({
      title: "Onboarding terminé !",
      description: "Bienvenue sur EmotionsCare. Votre profil est configuré.",
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  return (
    <Shell>
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Bienvenue sur EmotionsCare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="mb-4" />
            
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vos informations</h2>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Votre nom" 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="votre@email.com" 
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vos objectifs</h2>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="goal">Quel est votre objectif principal ?</Label>
                    <Select 
                      value={formData.goal} 
                      onValueChange={(value) => handleSelectChange('goal', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez un objectif" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stress-reduction">Réduction du stress</SelectItem>
                        <SelectItem value="emotional-balance">Équilibre émotionnel</SelectItem>
                        <SelectItem value="mindfulness">Pleine conscience</SelectItem>
                        <SelectItem value="better-sleep">Amélioration du sommeil</SelectItem>
                        <SelectItem value="productivity">Productivité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">À quelle fréquence souhaitez-vous utiliser l'application ?</Label>
                    <RadioGroup 
                      value={formData.frequency} 
                      onValueChange={(value) => handleSelectChange('frequency', value)}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="frequency-daily" />
                        <Label htmlFor="frequency-daily">Quotidiennement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="frequency-weekly" />
                        <Label htmlFor="frequency-weekly">Hebdomadairement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasional" id="frequency-occasional" />
                        <Label htmlFor="frequency-occasional">Occasionnellement</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vos préférences</h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-base">Quelles fonctionnalités vous intéressent ?</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="music-therapy" 
                          checked={formData.preferences.includes('music-therapy')} 
                          onCheckedChange={() => handleMultiCheckboxChange('music-therapy')}
                        />
                        <Label htmlFor="music-therapy">Musicothérapie</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="emotion-tracking" 
                          checked={formData.preferences.includes('emotion-tracking')} 
                          onCheckedChange={() => handleMultiCheckboxChange('emotion-tracking')}
                        />
                        <Label htmlFor="emotion-tracking">Suivi émotionnel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="ai-coach" 
                          checked={formData.preferences.includes('ai-coach')} 
                          onCheckedChange={() => handleMultiCheckboxChange('ai-coach')}
                        />
                        <Label htmlFor="ai-coach">Coach IA</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="vr-sessions" 
                          checked={formData.preferences.includes('vr-sessions')} 
                          onCheckedChange={() => handleMultiCheckboxChange('vr-sessions')}
                        />
                        <Label htmlFor="vr-sessions">Sessions immersives</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Configuration terminée</h2>
                <p>Merci d'avoir complété le processus d'onboarding. Votre profil est prêt à être utilisé.</p>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="notifications" 
                    name="notifications" 
                    checked={formData.notifications} 
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, notifications: checked as boolean })
                    }
                  />
                  <Label htmlFor="notifications">Je souhaite recevoir des notifications</Label>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={step === 1}
              >
                Retour
              </Button>
              <Button onClick={handleNext}>
                {step === totalSteps ? 'Terminer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default OnboardingPage;
