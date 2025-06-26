
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { User, Settings, Shield, Bell, Calendar, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    department: user?.user_metadata?.department || '',
    position: user?.user_metadata?.position || ''
  });

  const handleSave = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès."
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const userInitials = profileData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {getUserModeDisplayName(userMode)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
            </Avatar>
            <CardTitle>{profileData.name || 'Utilisateur'}</CardTitle>
            <p className="text-sm text-muted-foreground">{profileData.email}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut</span>
              <Badge variant="outline" className="text-green-600">Actif</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inscrit depuis</span>
              <span className="text-sm text-muted-foreground">
                {new Date(user?.created_at || '').toLocaleDateString('fr-FR')}
              </span>
            </div>
            {userMode === 'b2b_user' || userMode === 'b2b_admin' ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Département</span>
                    <span className="text-sm text-muted-foreground">{profileData.department || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Poste</span>
                    <span className="text-sm text-muted-foreground">{profileData.position || 'Non défini'}</span>
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">Personnel</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
                <TabsTrigger value="statistics">Statistiques</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Optionnel"
                    />
                  </div>
                  {(userMode === 'b2b_user' || userMode === 'b2b_admin') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="department">Département</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Ex: Ressources Humaines"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Poste</Label>
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Ex: Manager"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rappels quotidiens</span>
                        <Badge variant="outline">Activé</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rapports hebdomadaires</span>
                        <Badge variant="outline">Activé</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conseils personnalisés</span>
                        <Badge variant="outline">Activé</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Thème</span>
                        <Badge variant="outline">Automatique</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Langue</span>
                        <Badge variant="outline">Français</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Données privées</span>
                        <Badge variant="outline" className="text-green-600">Protégées</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <Calendar className="h-8 w-8 text-blue-500" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">42</p>
                          <p className="text-xs text-muted-foreground">Jours actifs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <Award className="h-8 w-8 text-green-500" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">12</p>
                          <p className="text-xs text-muted-foreground">Objectifs atteints</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <Shield className="h-8 w-8 text-purple-500" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">85%</p>
                          <p className="text-xs text-muted-foreground">Score bien-être</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
