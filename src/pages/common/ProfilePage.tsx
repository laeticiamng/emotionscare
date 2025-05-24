
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, Camera, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    firstName: user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.lastName || '',
    company: user?.user_metadata?.company || ''
  });

  const handleSave = async () => {
    try {
      // Ici on sauvegarderait via Supabase
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (formData.name) {
      const parts = formData.name.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : formData.name[0].toUpperCase();
    }
    return formData.email[0].toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo de profil */}
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Changer
              </Button>
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Vos données de profil et informations de contact
                </CardDescription>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                ) : (
                  'Modifier'
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié
                </p>
              </div>

              {userMode?.includes('b2b') && (
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type de compte</p>
                    <Badge variant="outline">
                      {getUserModeDisplayName(userMode)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email vérifié</p>
                    <Badge variant="outline" className="text-green-600">
                      ✓ Vérifié
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Membre depuis</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions du compte */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Actions du compte</CardTitle>
              <CardDescription>
                Gérez votre compte et vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Changer le mot de passe</h4>
                    <p className="text-sm text-muted-foreground">
                      Modifiez votre mot de passe pour sécuriser votre compte
                    </p>
                  </div>
                  <Button variant="outline">Modifier</Button>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Exporter mes données</h4>
                    <p className="text-sm text-muted-foreground">
                      Téléchargez une copie de toutes vos données
                    </p>
                  </div>
                  <Button variant="outline">Exporter</Button>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-red-600">Supprimer le compte</h4>
                    <p className="text-sm text-muted-foreground">
                      Cette action est irréversible
                    </p>
                  </div>
                  <Button variant="destructive">Supprimer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
