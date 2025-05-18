
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserPreferences } from '@/types/preferences';

interface IdentitySettingsProps {
  control: Control<UserPreferences, any>;
  isLoading: boolean;
}

const IdentitySettings: React.FC<IdentitySettingsProps> = ({
  control,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      {/* Pour l'avatar, nous utilisons une approche personnalisée car ce n'est pas un champ standard */}
      <div className="flex items-center space-x-4 rounded-lg border p-3 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {control._formValues.avatarUrl ? (
            <img 
              src={control._formValues.avatarUrl} 
              alt="Avatar utilisateur" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-2xl font-semibold text-muted-foreground">
              {control._formValues.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <FormLabel>Image de profil</FormLabel>
          <FormDescription>
            Cette image sera affichée sur votre profil
          </FormDescription>
          <div className="pt-2">
            <Input
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => {
                // Dans une implémentation réelle, ceci téléchargerait l'image
                // et mettrait à jour avatarUrl avec l'URL résultante
                console.log("Image sélectionnée:", e.target.files?.[0]);
              }}
            />
          </div>
        </div>
      </div>
      
      <FormItem>
        <FormLabel>Nom d'affichage</FormLabel>
        <FormControl>
          <Input 
            placeholder="Votre nom"
            value={control._formValues.displayName || ''}
            onChange={(e) => {
              control._formValues.displayName = e.target.value;
              control._formState.dirtyFields.displayName = true;
            }}
            disabled={isLoading}
          />
        </FormControl>
        <FormDescription>
          Le nom qui sera affiché aux autres utilisateurs
        </FormDescription>
      </FormItem>

      <FormItem>
        <FormLabel>Pronoms</FormLabel>
        <FormControl>
          <Input 
            placeholder="ex: il/lui, elle/elle, iel/ellui"
            value={control._formValues.pronouns || ''}
            onChange={(e) => {
              control._formValues.pronouns = e.target.value;
              control._formState.dirtyFields.pronouns = true;
            }}
            disabled={isLoading}
          />
        </FormControl>
        <FormDescription>
          Comment souhaitez-vous être désigné·e (facultatif)
        </FormDescription>
      </FormItem>
      
      <FormItem>
        <FormLabel>Biographie</FormLabel>
        <FormControl>
          <Textarea 
            placeholder="Partagez quelque chose à propos de vous..."
            value={control._formValues.biography || ''}
            onChange={(e) => {
              control._formValues.biography = e.target.value;
              control._formState.dirtyFields.biography = true;
            }}
            disabled={isLoading}
            rows={4}
          />
        </FormControl>
        <FormDescription>
          Une brève description qui sera visible sur votre profil
        </FormDescription>
      </FormItem>
    </div>
  );
};

export default IdentitySettings;
