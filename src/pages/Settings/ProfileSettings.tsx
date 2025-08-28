import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Globe, Palette, Eye } from 'lucide-react';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { A11yPanel } from '@/components/settings/A11yPanel';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const ProfileSettings: React.FC = () => {
  const { 
    profile, 
    loading, 
    error, 
    initialized, 
    updateTheme, 
    updateLanguage, 
    updateA11y 
  } = useProfileSettings();

  // Analytics
  useEffect(() => {
    if (initialized && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'settings.profile.view');
    }
  }, [initialized]);

  if (!initialized && loading) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Paramètres de profil</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience EmotionsCare selon vos préférences.
        </p>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Erreur : {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Langue et région
          </CardTitle>
          <CardDescription>
            Choisissez votre langue préférée
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Langue de l'interface</p>
                <p className="text-sm text-muted-foreground">
                  Actuel : {profile.language === 'fr' ? 'Français' : profile.language === 'en' ? 'English' : 'Auto'}
                </p>
              </div>
              
              <select
                value={profile.language}
                onChange={(e) => updateLanguage(e.target.value as typeof profile.language)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="auto">Automatique</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Apparence
          </CardTitle>
          <CardDescription>
            Choisissez votre thème préféré
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ThemeToggle 
            value={profile.theme} 
            onChange={updateTheme}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Accessibility */}
      <A11yPanel 
        value={profile.a11y} 
        onChange={updateA11y}
      />

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Aperçu en direct
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div 
            className="p-4 border rounded-lg bg-background/50"
            style={{ 
              fontSize: `${profile.a11y.font_scale}rem`,
              filter: profile.a11y.high_contrast ? 'contrast(1.2)' : undefined
            }}
          >
            <h4 className="font-medium mb-2">Exemple de contenu</h4>
            <p className="text-muted-foreground text-sm">
              Ceci est un aperçu de l'apparence du texte avec vos réglages actuels. 
              Les modifications s'appliquent immédiatement dans toute l'application.
            </p>
            
            <div className="mt-3 flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <div className="w-3 h-3 bg-muted rounded-full" />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3" aria-live="polite">
            💫 Vos préférences sont sauvegardées automatiquement
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;