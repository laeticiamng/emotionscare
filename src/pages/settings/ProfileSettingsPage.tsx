
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, MapPin, Camera } from 'lucide-react';

const ProfileSettingsPage: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@example.com',
    bio: 'Passionnée de bien-être et de développement personnel',
    location: 'Paris, France',
    birthDate: '1990-05-15',
    phone: '+33 6 12 34 56 78'
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres du Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo de Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback className="text-lg">MD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Changer la photo</Button>
                  <Button variant="ghost" size="sm">Supprimer</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de naissance
                </label>
                <Input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </label>
                <Input
                  value={profile.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous de vous..."
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques du Profil</CardTitle>
              <CardDescription>Votre activité sur EmotionsCare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">127</p>
                  <p className="text-xs text-muted-foreground">Jours actifs</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">85</p>
                  <p className="text-xs text-muted-foreground">Score moyen</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">23</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-xs text-muted-foreground">Sessions VR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1">
              Sauvegarder les modifications
            </Button>
            <Button variant="outline">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
