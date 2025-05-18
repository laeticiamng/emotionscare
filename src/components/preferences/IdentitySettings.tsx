
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface IdentitySettingsProps {
  preferences: {
    displayName: string;
    pronouns: string;
    biography: string;
  };
  onUpdate: (preferences: any) => void;
  isLoading?: boolean;
}

const IdentitySettings: React.FC<IdentitySettingsProps> = ({ 
  preferences: initialPreferences, 
  onUpdate, 
  isLoading = false 
}) => {
  // Create a mutable copy of the preferences
  const [preferences, setPreferences] = useState({
    displayName: initialPreferences.displayName,
    pronouns: initialPreferences.pronouns,
    biography: initialPreferences.biography
  });
  
  const { toast } = useToast();

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      displayName: e.target.value
    }));
  };

  const handlePronounsChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      pronouns: value
    }));
  };

  const handleBiographyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({
      ...prev,
      biography: e.target.value
    }));
  };

  const handleSave = () => {
    onUpdate(preferences);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations d'identité ont été enregistrées.",
    });
  };

  const handleReset = () => {
    setPreferences({
      displayName: initialPreferences.displayName,
      pronouns: initialPreferences.pronouns,
      biography: initialPreferences.biography
    });
    toast({
      title: "Profil réinitialisé",
      description: "Vos informations d'identité ont été réinitialisées.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identité & Profil</CardTitle>
        <CardDescription>
          Personnalisez la façon dont vous apparaissez sur la plateforme.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Nom d'affichage</Label>
          <Input
            id="display-name"
            value={preferences.displayName}
            onChange={handleDisplayNameChange}
            placeholder="Votre nom public"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Ce nom sera visible par les autres utilisateurs.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronoms</Label>
          <Select 
            value={preferences.pronouns} 
            onValueChange={handlePronounsChange}
            disabled={isLoading}
          >
            <SelectTrigger id="pronouns">
              <SelectValue placeholder="Sélectionner vos pronoms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he/him">Il/Lui</SelectItem>
              <SelectItem value="she/her">Elle</SelectItem>
              <SelectItem value="they/them">Iel/Iels</SelectItem>
              <SelectItem value="prefer-not-to-say">Préfère ne pas préciser</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Optionnel. Aide les autres à s'adresser à vous correctement.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="biography">Biographie</Label>
          <Textarea
            id="biography"
            value={preferences.biography}
            onChange={handleBiographyChange}
            placeholder="Partagez quelques mots à propos de vous"
            rows={4}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Maximum 300 caractères. {preferences.biography.length}/300
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Réinitialiser
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer le profil"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdentitySettings;
