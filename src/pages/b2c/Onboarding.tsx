
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const steps = [
  { id: 'profile', title: 'Profil personnel' },
  { id: 'preferences', title: 'Préférences émotionnelles' },
  { id: 'interests', title: 'Centres d\'intérêt' },
  { id: 'complete', title: 'Profil complet' },
];

const emotionalChallenges = [
  { id: 'stress', label: 'Stress' },
  { id: 'anxiety', label: 'Anxiété' },
  { id: 'sleep', label: 'Problèmes de sommeil' },
  { id: 'focus', label: 'Difficultés de concentration' },
  { id: 'motivation', label: 'Manque de motivation' },
  { id: 'sadness', label: 'Tristesse récurrente' },
];

const interestCategories = [
  { id: 'music', label: 'Musicothérapie' },
  { id: 'meditation', label: 'Méditation guidée' },
  { id: 'breathing', label: 'Exercices de respiration' },
  { id: 'vr', label: 'Expériences de réalité virtuelle' },
  { id: 'coaching', label: 'Coaching émotionnel' },
  { id: 'journal', label: 'Journal émotionnel' },
];

const B2COnboarding: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Formulaire d'onboarding
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    challenges: [] as string[],
    interests: [] as string[],
    notifications: true,
    moodTracking: true,
    preferredTime: 'morning',
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCheckboxChange = (field: string, itemId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...formData[field as keyof typeof formData] as string[], itemId]
      });
    } else {
      setFormData({
        ...formData,
        [field]: (formData[field as keyof typeof formData] as string[]).filter(id => id !== itemId)
      });
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulez la mise à jour du profil utilisateur
      const profileData = {
        ...formData,
        onboardingCompleted: true
      };
      
      if (updateUserProfile) {
        await updateUserProfile(profileData);
        toast.success('Profil mis à jour avec succès');
      } else {
        console.warn('updateUserProfile function not available');
        // Simuler un délai pour montrer le chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Profil créé avec succès');
      }
      
      // Rediriger vers le tableau de bord
      navigate('/b2c/dashboard');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Profile personnel
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Votre âge"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Genre</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Femme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Autre</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Profession</Label>
              <Select value={formData.occupation} onValueChange={(value) => handleChange('occupation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant(e)</SelectItem>
                  <SelectItem value="employee">Employé(e)</SelectItem>
                  <SelectItem value="self-employed">Auto-entrepreneur</SelectItem>
                  <SelectItem value="retired">Retraité(e)</SelectItem>
                  <SelectItem value="unemployed">En recherche d'emploi</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 1: // Préférences émotionnelles
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quels défis émotionnels souhaitez-vous relever ?</Label>
              <div className="grid grid-cols-2 gap-2">
                {emotionalChallenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={challenge.id}
                      checked={formData.challenges.includes(challenge.id)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('challenges', challenge.id, checked === true)
                      }
                    />
                    <Label htmlFor={challenge.id}>{challenge.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Quand préférez-vous pratiquer vos exercices ?</Label>
              <RadioGroup
                value={formData.preferredTime}
                onValueChange={(value) => handleChange('preferredTime', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning">Matin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon">Après-midi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening">Soir</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 2: // Centres d'intérêt
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quelles activités vous intéressent ?</Label>
              <div className="grid grid-cols-2 gap-2">
                {interestCategories.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('interests', interest.id, checked === true)
                      }
                    />
                    <Label htmlFor={interest.id}>{interest.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) => handleChange('notifications', checked === true)}
                />
                <Label htmlFor="notifications">Recevoir des rappels et notifications</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="moodTracking"
                  checked={formData.moodTracking}
                  onCheckedChange={(checked) => handleChange('moodTracking', checked === true)}
                />
                <Label htmlFor="moodTracking">Activer le suivi quotidien d'humeur</Label>
              </div>
            </div>
          </div>
        );
        
      case 3: // Récapitulatif
        return (
          <div className="space-y-6 py-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-12 h-12 mx-auto flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-center text-lg font-medium">Profil complété avec succès !</h3>
            
            <p className="text-center text-muted-foreground">
              Merci d'avoir complété votre profil. Vos préférences nous permettront de vous offrir une expérience personnalisée.
            </p>
            
            <div className="flex justify-center">
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalisation...
                  </>
                ) : (
                  <>
                    Accéder au tableau de bord <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription>
            Complétez votre profil pour une expérience personnalisée ({currentStep + 1}/{steps.length})
          </CardDescription>
        </CardHeader>
        
        <div className="px-6">
          <div className="relative">
            <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted">
              <div 
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    index <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">{steps[currentStep].title}</h3>
          {renderStep()}
        </CardContent>
        
        {currentStep < steps.length - 1 && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            <Button onClick={handleNext}>
              Suivant <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default B2COnboarding;
