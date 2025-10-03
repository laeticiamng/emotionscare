import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Globe, Palette } from 'lucide-react';
import { ProfileDraft } from '@/store/onboarding.store';

interface StepProfileProps {
  onSubmit: (profile: ProfileDraft) => Promise<boolean>;
  onBack: () => void;
  initialData?: ProfileDraft;
}

export const StepProfile: React.FC<StepProfileProps> = ({ 
  onSubmit, 
  onBack,
  initialData 
}) => {
  const [profile, setProfile] = useState<ProfileDraft>({
    language: initialData?.language || 'fr',
    theme: initialData?.theme || 'system',
    displayName: initialData?.displayName || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onSubmit(profile);
    if (success) {
      // onSubmit will handle navigation
    }
    
    setLoading(false);
  };

  const canSubmit = profile.language && profile.theme;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Ton profil
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure tes préférences de base
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Langue
            </Label>
            <Select
              value={profile.language}
              onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Choisir une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label htmlFor="theme" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Thème
            </Label>
            <Select
              value={profile.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => 
                setProfile(prev => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Choisir un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Automatique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">
              Nom d'affichage (optionnel)
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Comment veux-tu qu'on t'appelle ?"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Utilisé pour la gamification et les classements
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={onBack}
              className="w-full"
            >
              Précédent
            </Button>
            <Button 
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full"
            >
              {loading ? 'Sauvegarde...' : 'Suivant'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};