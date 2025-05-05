
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/data/mockUsers';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: UserRole.USER,
    dailyGoal: 1,
    weeklyGoal: 3,
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      backgroundColor: 'default'
    },
    anonymity: true
  });
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    try {
      // Generate an anonymity code based on name
      const anonymity_code = `${formData.name.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      // In a real app, we would update the user in the database
      const updatedUser = await updateUser({
        ...user,
        name: formData.name,
        role: formData.role,
        dailyGoal: formData.dailyGoal,
        weeklyGoal: formData.weeklyGoal,
        preferences: formData.preferences,
        anonymity_code: anonymity_code,
        onboarded: true
      });
      
      setUser(updatedUser);
      
      toast({
        title: "Configuration terminée",
        description: "Votre profil a été mis à jour avec succès.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${step === num ? 'bg-primary text-primary-foreground' : 
                step > num ? 'bg-primary/80 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {step > num ? <Check className="h-4 w-4" /> : num}
          </div>
          {num < 3 && (
            <Separator className="w-8 h-px" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Bienvenue sur MindCare</CardTitle>
          <CardDescription className="text-center">
            Configurez votre profil pour une expérience personnalisée
          </CardDescription>
          {renderStepIndicator()}
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Votre nom</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Votre rôle</Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value as UserRole})}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={UserRole.USER} id="role-user" />
                    <Label htmlFor="role-user">Utilisateur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={UserRole.MANAGER} id="role-manager" />
                    <Label htmlFor="role-manager">Manager</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Préférence de thème</Label>
                <RadioGroup 
                  value={formData.preferences.theme} 
                  onValueChange={(value) => setFormData({...formData, preferences: {...formData.preferences, theme: value}})}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Clair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Sombre</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Taille de police</Label>
                <RadioGroup 
                  value={formData.preferences.fontSize} 
                  onValueChange={(value) => setFormData({...formData, preferences: {...formData.preferences, fontSize: value}})}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="font-small" />
                    <Label htmlFor="font-small">Petite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="font-medium" />
                    <Label htmlFor="font-medium">Moyenne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="font-large" />
                    <Label htmlFor="font-large">Grande</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Objectif quotidien de sessions bien-être</Label>
                <RadioGroup 
                  value={formData.dailyGoal.toString()} 
                  onValueChange={(value) => setFormData({...formData, dailyGoal: parseInt(value)})}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="daily-1" />
                    <Label htmlFor="daily-1">1 session</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="daily-2" />
                    <Label htmlFor="daily-2">2 sessions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="daily-3" />
                    <Label htmlFor="daily-3">3 sessions</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Objectif hebdomadaire de sessions bien-être</Label>
                <RadioGroup 
                  value={formData.weeklyGoal.toString()}  
                  onValueChange={(value) => setFormData({...formData, weeklyGoal: parseInt(value)})}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="weekly-3" />
                    <Label htmlFor="weekly-3">3 sessions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="weekly-5" />
                    <Label htmlFor="weekly-5">5 sessions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="7" id="weekly-7" />
                    <Label htmlFor="weekly-7">7 sessions</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevStep}>Précédent</Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/login')}>Annuler</Button>
          )}
          
          {step < 3 ? (
            <Button onClick={handleNextStep}>Suivant</Button>
          ) : (
            <Button onClick={handleComplete}>Terminer</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
