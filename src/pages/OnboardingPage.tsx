
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FontSizeOption = 'small' | 'medium' | 'large';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // State for each step
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [position, setPosition] = useState(user?.position || '');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light');
  const [fontSize, setFontSize] = useState<FontSizeOption>(
    (user?.preferences?.font_size as FontSizeOption) || 'medium'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preferences?.notifications_enabled !== false
  );
  
  const totalSteps = 3;
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    if (!user) return;
    
    try {
      await updateUser({
        ...user,
        name: username,
        department,
        position,
        preferences: {
          ...user.preferences,
          theme,
          font_size: fontSize,
          notifications_enabled: notificationsEnabled
        }
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  
  // Handler for font size changes
  const handleFontSizeChange = (val: FontSizeOption) => {
    setFontSize(val);
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Bienvenue sur EmotionsCare</h1>
          <p className="text-muted-foreground">
            Étape {currentStep} sur {totalSteps}
          </p>
        </CardHeader>
        
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Ingénierie</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="hr">Ressources Humaines</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Développeur Senior"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Thème et apparence</h2>
              
              <div className="space-y-2">
                <Label>Thème</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Clair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Sombre</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pastel" id="theme-pastel" />
                    <Label htmlFor="theme-pastel">Pastel</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Taille de police</Label>
                <Select 
                  value={fontSize} 
                  onValueChange={(value) => handleFontSizeChange(value as FontSizeOption)}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Notifications</h2>
              
              <div className="space-y-2">
                <Label>Activer les notifications</Label>
                <RadioGroup 
                  value={notificationsEnabled ? "yes" : "no"} 
                  onValueChange={(value) => setNotificationsEnabled(value === "yes")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="notifications-yes" />
                    <Label htmlFor="notifications-yes">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="notifications-no" />
                    <Label htmlFor="notifications-no">Non</Label>
                  </div>
                </RadioGroup>
                
                {notificationsEnabled && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous recevrez des notifications pour les analyses émotionnelles, 
                    les recommandations et les rappels.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={goToNextStep}>Suivant</Button>
          ) : (
            <Button onClick={handleComplete}>Terminer</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
