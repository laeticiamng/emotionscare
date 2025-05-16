import React, { useState } from 'react';
import { UserPreferences } from '@/types/preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, X, Camera } from 'lucide-react';

interface IdentitySettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

const IdentitySettings: React.FC<IdentitySettingsProps> = ({
  preferences,
  onChange,
}) => {
  const [avatar, setAvatar] = useState<string | null>(preferences.avatarUrl || null);
  
  // Form state
  const [form, setForm] = useState({
    displayName: preferences.displayName || "",
    pronouns: preferences.pronouns || "",
    biography: preferences.biography || ""
  });
  
  // Handle field changes
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setAvatar(url);
      onChange({
        avatarUrl: url
      });
    }
  };
  
  // Remove avatar
  const handleAvatarRemove = () => {
    setAvatar(null);
    onChange({
      avatarUrl: undefined
    });
  };
  
  // Save form data
  const handleSubmit = () => {
    onChange({
      displayName: form.displayName,
      pronouns: form.pronouns,
      biography: form.biography
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Identité et profil</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar || undefined} alt="Avatar" />
                <AvatarFallback>
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              
              {avatar && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0 h-6 w-6 rounded-full"
                  onClick={handleAvatarRemove}
                >
                  <X size={12} />
                </Button>
              )}
              
              <div className="mt-2 flex justify-center">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <Camera size={16} />
                    <span>{avatar ? "Changer d'avatar" : "Ajouter un avatar"}</span>
                  </div>
                  <Input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                  />
                </Label>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <Label htmlFor="displayName">Nom à afficher</Label>
                <Input
                  id="displayName"
                  value={form.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Comment voulez-vous être appelé ?"
                />
              </div>
              
              <div>
                <Label htmlFor="pronouns">Pronoms</Label>
                <Input
                  id="pronouns"
                  value={form.pronouns}
                  onChange={(e) => handleChange('pronouns', e.target.value)}
                  placeholder="Vos pronoms (optionnel)"
                />
              </div>
              
              <div>
                <Label htmlFor="biography">À propos de moi</Label>
                <Textarea
                  id="biography"
                  value={form.biography}
                  onChange={(e) => handleChange('biography', e.target.value)}
                  placeholder="Partagez quelque chose à propos de vous..."
                  rows={4}
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full">
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentitySettings;
