import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Camera, Shield } from 'lucide-react';
import { LoadingState, ErrorState, useLoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { toast } from 'sonner';

const B2CProfileSettingsPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionnée de bien-être et de développement personnel. J\'utilise EmotionsCare pour maintenir un équilibre émotionnel au quotidien.',
    location: 'Paris, France',
    birthDate: '1985-03-15',
    avatar: ''
  });
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingState type="card" />;
  if (loadingState === 'error') return <ErrorState error="Erreur de chargement" />;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset des modifications
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Paramètres du Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar et infos rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="outline" size="sm" className="mb-4">
                <Camera className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
              
              <div className="space-y-2">
                <h3 className="font-semibold">
                  {profile.firstName} {profile.lastName}
                </h3>
                <Badge variant="secondary">Utilisateur B2C</Badge>
                <p className="text-xs text-muted-foreground">
                  Membre depuis Mars 2024
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informations Personnelles</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de naissance
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={profile.birthDate}
                  disabled={!isEditing}
                  onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                disabled={!isEditing}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Parlez-nous de vous..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sécurité et Confidentialité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Sécurité & Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Mot de passe</h4>
                <p className="text-sm text-muted-foreground">
                  Dernière modification : il y a 2 mois
                </p>
              </div>
              <Button variant="outline">
                Modifier
              </Button>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Authentification à deux facteurs</h4>
                <p className="text-sm text-muted-foreground">
                  Sécurisez votre compte avec une vérification supplémentaire
                </p>
              </div>
              <Button variant="outline">
                Configurer
              </Button>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Données personnelles</h4>
                <p className="text-sm text-muted-foreground">
                  Gérez vos préférences de confidentialité et données
                </p>
              </div>
              <Button variant="outline">
                Voir les paramètres RGPD
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CProfileSettingsPage;