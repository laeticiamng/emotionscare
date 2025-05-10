
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { FontSize, ThemeName, User } from '@/types';

const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>(user?.name || '');
  const [theme, setTheme] = useState<ThemeName>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user) return;
      
      // Mise à jour des préférences de l'utilisateur
      const updatedUser: User = {
        ...user,
        name,
        preferences: {
          theme,
          fontSize,
          font: 'inter',
          notifications_enabled: notificationsEnabled,
          email_notifications: emailNotifications,
          push_notifications: true
        },
        onboarded: true,
        joined_at: new Date().toISOString(),
        avatar_url: user.avatar_url || ''
      };
      
      await updateUser(updatedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bienvenue !</CardTitle>
          <CardDescription>
            Configurez votre expérience pour commencer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Votre nom</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Comment souhaitez-vous être appelé ?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Thème</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => setTheme(value as ThemeName)}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Clair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Sombre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Système</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Taille de police</Label>
              <RadioGroup 
                value={fontSize} 
                onValueChange={(value) => setFontSize(value as FontSize)}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Petite</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Moyenne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Grande</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <Label>Notifications</Label>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">
                  Notifications dans l'application
                </Label>
                <Switch 
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="text-sm">
                  Notifications par email
                </Label>
                <Switch 
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Commencer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
