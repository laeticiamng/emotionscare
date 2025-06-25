
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, User, Shield, Database, Trash2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profession: 'Médecin',
    hospital: 'Hôpital Central',
    phone: '+33 1 23 45 67 89'
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    dataEncryption: true
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    dataRetention: 365,
    anonymousAnalytics: false,
    exportFormat: 'json'
  });

  const handleProfileSave = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    });
  };

  const handleSecuritySave = () => {
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Vos paramètres de sécurité ont été sauvegardés.",
    });
  };

  const handleExportData = () => {
    // Simuler l'export de données
    toast({
      title: "Export en cours",
      description: "Vos données sont en cours de préparation pour le téléchargement.",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import réussi",
      description: "Vos données ont été importées avec succès.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé définitivement.",
      variant: "destructive"
    });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Données
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Compte
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={profile.profession}
                      onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Établissement</Label>
                    <Input
                      id="hospital"
                      value={profile.hospital}
                      onChange={(e) => setProfile(prev => ({ ...prev, hospital: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <Button onClick={handleProfileSave}>
                  Sauvegarder le profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Authentification à deux facteurs</h3>
                    <p className="text-sm text-muted-foreground">
                      Sécurisez votre compte avec la 2FA
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alertes de connexion</h3>
                    <p className="text-sm text-muted-foreground">
                      Être notifié des nouvelles connexions
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Chiffrement des données</h3>
                    <p className="text-sm text-muted-foreground">
                      Chiffrer toutes les données sensibles
                    </p>
                  </div>
                  <Switch
                    checked={security.dataEncryption}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, dataEncryption: checked }))}
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <Button onClick={handleSecuritySave}>
                    Sauvegarder les paramètres de sécurité
                  </Button>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Changement de mot de passe</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Pour votre sécurité, changez régulièrement votre mot de passe
                    </p>
                    <Button variant="outline" size="sm">
                      Changer le mot de passe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sauvegarde automatique</h3>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarder automatiquement vos données
                    </p>
                  </div>
                  <Switch
                    checked={dataSettings.autoBackup}
                    onCheckedChange={(checked) => setDataSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Durée de conservation (jours)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={dataSettings.dataRetention}
                    onChange={(e) => setDataSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) || 365 }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Analytics anonymes</h3>
                    <p className="text-sm text-muted-foreground">
                      Partager des données anonymisées pour améliorer l'app
                    </p>
                  </div>
                  <Switch
                    checked={dataSettings.anonymousAnalytics}
                    onCheckedChange={(checked) => setDataSettings(prev => ({ ...prev, anonymousAnalytics: checked }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exporter mes données
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleImportData}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Importer des données
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">RGPD et confidentialité</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles
                  </p>
                  <Button variant="outline" size="sm">
                    Voir mes droits RGPD
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Désactivation temporaire</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Désactivez temporairement votre compte. Vous pourrez le réactiver à tout moment.
                  </p>
                  <Button variant="outline">
                    Désactiver temporairement
                  </Button>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2">Zone de danger</h3>
                  <p className="text-sm text-red-700 mb-4">
                    La suppression de votre compte est définitive et irréversible. 
                    Toutes vos données seront perdues.
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Supprimer définitivement mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre
                          compte et toutes vos données de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Oui, supprimer définitivement
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Besoin d'aide ?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Notre équipe support est là pour vous aider avec toutes vos questions
                  </p>
                  <Button variant="outline" size="sm">
                    Contacter le support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
