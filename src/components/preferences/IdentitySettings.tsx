
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

const IdentitySettings = () => {
  const { toast } = useToast();
  const [identity, setIdentity] = useState({
    displayName: 'Utilisateur',
    firstName: '',
    lastName: '',
    pronouns: 'il',
    biography: '',
    avatarUrl: '',
  });

  const handleChange = (key: string, value: string) => {
    setIdentity(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Identité mise à jour",
      description: "Vos informations personnelles ont été enregistrées."
    });
  };

  const getInitials = () => {
    if (identity.firstName && identity.lastName) {
      return `${identity.firstName[0]}${identity.lastName[0]}`.toUpperCase();
    } else if (identity.displayName) {
      return identity.displayName[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="w-24 h-24 text-2xl">
            <AvatarImage src={identity.avatarUrl} />
            <AvatarFallback className="bg-primary/20">{getInitials()}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Changer l'avatar
          </Button>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="displayName">Nom d'affichage</Label>
            <Input
              id="displayName"
              value={identity.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              placeholder="Comment souhaitez-vous être appelé(e) ?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={identity.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Prénom"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={identity.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Nom"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="pronouns">Pronom préféré</Label>
            <Select
              value={identity.pronouns}
              onValueChange={(value) => handleChange('pronouns', value)}
            >
              <SelectTrigger id="pronouns">
                <SelectValue placeholder="Choisir un pronom" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="il">Il / Lui</SelectItem>
                <SelectItem value="elle">Elle / Elle</SelectItem>
                <SelectItem value="iel">Iel / Ellui</SelectItem>
                <SelectItem value="autre">Autre / Neutre</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Ce pronom sera utilisé dans les modules empathiques de l'application
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="biography">Biographie</Label>
        <Textarea
          id="biography"
          value={identity.biography}
          onChange={(e) => handleChange('biography', e.target.value)}
          placeholder="Comment souhaitez-vous qu'on vous accueille ici ?"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Cette information aide le coach virtuel à mieux personnaliser ses interactions avec vous
        </p>
      </div>
      
      <Button onClick={saveSettings} className="w-full">
        Enregistrer les informations
      </Button>
    </div>
  );
};

export default IdentitySettings;
