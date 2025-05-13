
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const OnboardingSteps = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare',
    description: 'Configurons votre profil pour personnaliser votre expérience.'
  },
  {
    id: 'personal-info',
    title: 'Informations personnelles',
    description: 'Ces informations nous aideront à adapter notre accompagnement.'
  },
  {
    id: 'interests',
    title: 'Vos centres d'intérêt',
    description: 'Pour vous proposer des contenus qui vous correspondent.'
  },
  {
    id: 'complete',
    title: 'Félicitations !',
    description: 'Votre profil est maintenant configuré.'
  }
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    displayName: '',
    language: 'fr',
    interests: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update user profile with onboarding information
      await updateUser({
        ...user,
        name: formData.displayName || user.name,
        onboarded: true,
        preferences: {
          ...user.preferences,
          language: formData.language,
        }
      });
      
      toast({
        title: 'Profil configuré',
        description: 'Votre profil a été configuré avec succès.'
      });
      
      // Redirect based on user role
      if (user.role === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      } else if (user.role === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else {
        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la configuration de votre profil.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    const currentStepData = OnboardingSteps[currentStep];
    
    switch (currentStepData.id) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="mb-6 mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg mb-6">
              Nous sommes ravis de vous accueillir sur EmotionsCare. 
              Prenez quelques instants pour configurer votre profil afin de personnaliser votre expérience.
            </p>
            <Button onClick={handleNext}>Commencer</Button>
          </div>
        );
        
      case 'personal-info':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nom d'affichage</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Comment souhaitez-vous être appelé ?"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Langue préférée</Label>
              <RadioGroup 
                value={formData.language} 
                onValueChange={(value) => setFormData({...formData, language: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fr" id="fr" />
                  <Label htmlFor="fr">Français</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">English</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 'interests':
        const interests = ['Méditation', 'Musique', 'Lecture', 'Sport', 'Nature', 'Art', 'Voyage'];
        
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Sélectionnez les activités que vous appréciez (utilisées pour personnaliser les recommandations)
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <div 
                  key={interest}
                  className={`
                    border rounded-md p-3 cursor-pointer transition-colors
                    ${formData.interests.includes(interest) 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted'}
                  `}
                  onClick={() => {
                    if (formData.interests.includes(interest)) {
                      setFormData({
                        ...formData,
                        interests: formData.interests.filter(i => i !== interest)
                      });
                    } else {
                      setFormData({
                        ...formData,
                        interests: [...formData.interests, interest]
                      });
                    }
                  }}
                >
                  <div className="flex items-center">
                    {formData.interests.includes(interest) && (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    )}
                    <span>{interest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="text-center">
            <div className="mb-6 mx-auto bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <p className="text-lg mb-6">
              Votre profil est maintenant configuré ! Vous êtes prêt à commencer votre parcours de bien-être émotionnel.
            </p>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Finalisation...' : 'Accéder à mon espace'}
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{OnboardingSteps[currentStep].title}</CardTitle>
          <CardDescription>{OnboardingSteps[currentStep].description}</CardDescription>
        </CardHeader>
        
        <CardContent className="py-4">
          {renderStepContent()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep > 0 && currentStep < OnboardingSteps.length - 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Précédent
            </Button>
          )}
          
          <div className="flex-1" />
          
          {currentStep > 0 && currentStep < OnboardingSteps.length - 1 && (
            <Button onClick={handleNext}>
              Suivant
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
