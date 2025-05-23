
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { User, Mail, Shield, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    toast.success("Profil mis à jour avec succès!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Annuler
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Vos informations de base et de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mot de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Dernière modification il y a 3 mois
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Authentification à deux facteurs</h4>
                  <p className="text-sm text-muted-foreground">
                    Non configurée
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type de compte</span>
                  <span className="text-sm font-medium">
                    {getUserModeDisplayName(userMode)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <span className="text-sm font-medium text-green-600">Actif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Membre depuis</span>
                  <span className="text-sm font-medium">Décembre 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-xs text-muted-foreground">Analyses</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-xs text-muted-foreground">Score moyen</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-muted-foreground">Publications</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-xs text-muted-foreground">Amis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Exporter mes données
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Shield className="mr-2 h-4 w-4" />
                Paramètres de confidentialité
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
