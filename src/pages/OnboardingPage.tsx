
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeName, User, UserPreferences } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [position, setPosition] = useState(user?.position || '');
  const [theme, setTheme] = useState<ThemeName>(user?.preferences?.theme || 'light');
  const [language, setLanguage] = useState(user?.preferences?.language || 'fr');
  const [fontSize, setFontSize] = useState(user?.preferences?.font_size || 'medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    user?.preferences?.notifications_enabled !== undefined 
      ? user.preferences.notifications_enabled 
      : true
  );
  
  const handleComplete = () => {
    if (!user) return;
    
    const preferences: UserPreferences = {
      theme: theme === "system" ? "light" : theme, // Handle "system" by defaulting to "light"
      font_size: fontSize as 'small' | 'medium' | 'large',
      notifications_enabled: notificationsEnabled,
      language,
    };
    
    const updatedUser: User = {
      ...user,
      name,
      department,
      position,
      preferences,
      onboarded: true
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    navigate('/dashboard');
  };
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription>
            Configurez votre profil pour une expérience personnalisée
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Ex: Ressources humaines, Marketing, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ex: Manager, Développeur, etc."
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Préférences d'affichage</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="theme">Thème</Label>
              <RadioGroup
                id="theme"
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeName)}
                className="flex space-x-4"
              >
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
            
            <div className="grid gap-2">
              <Label htmlFor="font-size">Taille de police</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="language">Langue</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notifications">Notifications</Label>
              <RadioGroup
                id="notifications"
                value={notificationsEnabled ? "enabled" : "disabled"}
                onValueChange={(value) => setNotificationsEnabled(value === "enabled")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="notifications-enabled" />
                  <Label htmlFor="notifications-enabled">Activées</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="notifications-disabled" />
                  <Label htmlFor="notifications-disabled">Désactivées</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <Button onClick={handleComplete} className="w-full">
            Terminer la configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
