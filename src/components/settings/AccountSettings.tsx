import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AccountSettingsProps {
  user: User | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    position: user?.position || '',
    department: user?.department || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would update the user profile here
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de compte ont été mises à jour avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom complet
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              L'adresse email ne peut pas être modifiée.
            </p>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="position" className="text-sm font-medium">
              Poste
            </label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="department" className="text-sm font-medium">
              Département
            </label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{user?.name || 'Utilisateur'}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Button onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-1">Poste</p>
                  <p className="text-sm text-muted-foreground">{user?.position || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Département</p>
                  <p className="text-sm text-muted-foreground">{user?.department || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Rôle</p>
                  <p className="text-sm text-muted-foreground">{user?.role || 'Utilisateur'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'Non disponible'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountSettings;
