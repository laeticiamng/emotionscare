import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { FontSize, ThemeName, User } from '@/types';
import { useUserMode } from '@/contexts/UserModeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || (userMode === 'b2c' ? 'personal' : 'business');
  
  const [name, setName] = useState<string>(user?.name || '');
  const [theme, setTheme] = useState<ThemeName>('light');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [department, setDepartment] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // If user has already completed onboarding, redirect to dashboard
    if (user?.onboarded) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user) return;
      
      // Common user preferences
      const updatedUser: User = {
        ...user,
        name,
        preferences: {
          theme,
          fontSize,
          fontFamily: 'inter',
          notifications_enabled: notificationsEnabled,
          email_notifications: emailNotifications,
          push_notifications: true
        },
        onboarded: true,
        joined_at: new Date().toISOString(),
        avatar_url: user.avatar_url || ''
      };
      
      // Add business-specific fields if in business mode
      if (mode === 'business' || userMode === 'b2b-collaborator' || userMode === 'b2b-admin') {
        updatedUser.department = department;
        updatedUser.position = position;
      }
      
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
            {mode === 'business' 
              ? 'Configurez votre profil professionnel' 
              : 'Configurez votre expérience pour commencer'}
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
            
            {/* Business-specific fields */}
            {(mode === 'business' || userMode === 'b2b-collaborator' || userMode === 'b2b-admin') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Sélectionnez votre département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="tech">Technique / IT</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Opérations</SelectItem>
                      <SelectItem value="direction">Direction</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input 
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Votre fonction dans l'entreprise"
                  />
                </div>
              </>
            )}
            
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
