
import React, { useState } from 'react';
import { UserPreferences } from '@/types/preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';

interface IdentitySettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const IdentitySettings: React.FC<IdentitySettingsProps> = ({
  preferences,
  onChange,
}) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarUrl = preferences.avatarUrl || '';
  
  // Local state for form fields
  const [displayName, setDisplayName] = useState(preferences.displayName || '');
  const [pronouns, setPronouns] = useState(preferences.pronouns || '');
  const [biography, setBiography] = useState(preferences.biography || '');
  
  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const updatedPreferences = {
            ...preferences,
            avatarUrl: event.target.result as string
          };
          onChange(updatedPreferences);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPreferences = {
      ...preferences,
      avatarUrl,
      displayName,
      pronouns,
      biography
    };
    
    onChange(updatedPreferences);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Photo de profil" />
            ) : (
              <AvatarFallback>
                <User size={48} />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              <Upload size={16} className="mr-2" />
              Changer d'avatar
            </Label>
            <Input 
              id="avatar" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Nom d'affichage</Label>
          <Input 
            id="displayName" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Comment souhaitez-vous être appelé ?"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronoms</Label>
          <Input 
            id="pronouns" 
            value={pronouns} 
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="ex: il/lui, elle/elle, iel/ellui"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="biography">Biographie</Label>
          <Textarea 
            id="biography" 
            value={biography} 
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Parlez un peu de vous..."
            rows={4}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Enregistrer les modifications
      </Button>
    </form>
  );
};

export default IdentitySettings;
