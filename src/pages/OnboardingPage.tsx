import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, Palette } from 'lucide-react';
import { ThemeName } from '@/types';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('light');
  const [selectedFontSize, setSelectedFontSize] = useState('medium');
  const [selectedFont, setSelectedFont] = useState('inter');
  const [profileName, setProfileName] = useState(user?.name || '');

  // Modifier les références à font_size pour utiliser fontSize
  const initialPreferences = {
    theme: 'light' as ThemeName,
    fontSize: 'medium', // Utiliser fontSize au lieu de font_size
    font: 'inter',
    notifications_enabled: true,
    email_notifications: true,
    push_notifications: true,
  };

  useEffect(() => {
    if (user && user.onboarded) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'pastel':
        return <Palette className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case 'dark':
        return 'Sombre';
      case 'pastel':
        return 'Pastel';
      default:
        return 'Clair';
    }
  };

  // Dans le handleSubmit, utiliser fontSize au lieu de font_size
  const handleSubmit = () => {
    const userPreferences = {
      theme: selectedTheme,
      fontSize: selectedFontSize, // Utiliser fontSize au lieu de font_size
      font: selectedFont,
      notifications_enabled: true,
      email_notifications: true,
      push_notifications: true,
    };

    const updatedUser = {
      ...user,
      name: profileName,
      preferences: userPreferences,
      onboarded: true,
    };

    updateUser(updatedUser).then(() => {
      toast({
        title: "Bienvenue !",
        description: "Vos préférences ont été enregistrées.",
      });
      navigate('/dashboard');
    });
  };

  // Dans le rendu, corriger l'endroit où setSelectedTheme est appelé avec 'pastel'
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Personnalisez votre expérience</CardTitle>
          <CardDescription>Choisissez vos préférences pour une expérience optimale.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="profileName">Nom du profil</Label>
            <Input
              id="profileName"
              placeholder="Votre nom"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <div>
            <Label>Thème</Label>
            <div className="flex space-x-4">
              {['light', 'dark', 'pastel'].map((theme) => (
                <Button
                  key={theme}
                  variant={selectedTheme === theme ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedTheme(theme as ThemeName)}
                >
                  {getThemeIcon(theme)}
                  <span className="ml-2">{getThemeLabel(theme)}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Taille de la police</Label>
            <div className="flex space-x-4">
              {['small', 'medium', 'large'].map((size) => (
                <Button
                  key={size}
                  variant={selectedFontSize === size ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedFontSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Police</Label>
            <div className="flex space-x-4">
              {['inter', 'roboto', 'montserrat'].map((font) => (
                <Button
                  key={font}
                  variant={selectedFont === font ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedFont(font)}
                >
                  {font}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Enregistrer et continuer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
