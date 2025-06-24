
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Bell, Download, Trash2 } from 'lucide-react';

const PrivacyTogglesPage: React.FC = () => {
  const [settings, setSettings] = useState({
    dataCollection: true,
    analytics: true,
    personalizedAds: false,
    emotionTracking: true,
    locationServices: false,
    voiceAnalysis: true,
    shareWithTeam: true,
    adminAccess: false,
    exportData: true,
    deleteOnRequest: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres de Confidentialité</h1>
          <p className="text-muted-foreground">Contrôlez vos données et votre vie privée</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Statut de Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">Élevé</Badge>
                <p className="text-sm text-muted-foreground">
                  Vos données sont bien protégées selon vos préférences
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Données Collectées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">7/10</div>
                <p className="text-sm text-muted-foreground">Types de données autorisés</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                Alertes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Notifications de confidentialité</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collecte de Données</CardTitle>
              <CardDescription>Contrôlez quelles données nous pouvons collecter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Collecte générale de données</p>
                  <p className="text-sm text-muted-foreground">Données d'utilisation de base pour améliorer l'expérience</p>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={() => handleToggle('dataCollection')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics et métriques</p>
                  <p className="text-sm text-muted-foreground">Analyse de performance et d'engagement</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={() => handleToggle('analytics')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Suivi émotionnel</p>
                  <p className="text-sm text-muted-foreground">Enregistrement de vos états émotionnels</p>
                </div>
                <Switch
                  checked={settings.emotionTracking}
                  onCheckedChange={() => handleToggle('emotionTracking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analyse vocale</p>
                  <p className="text-sm text-muted-foreground">Traitement des enregistrements audio pour l'IA</p>
                </div>
                <Switch
                  checked={settings.voiceAnalysis}
                  onCheckedChange={() => handleToggle('voiceAnalysis')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partage et Accès</CardTitle>
              <CardDescription>Gérez qui peut accéder à vos informations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partage avec l'équipe</p>
                  <p className="text-sm text-muted-foreground">Données anonymisées partagées avec votre équipe B2B</p>
                </div>
                <Switch
                  checked={settings.shareWithTeam}
                  onCheckedChange={() => handleToggle('shareWithTeam')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Accès administrateur</p>
                  <p className="text-sm text-muted-foreground">Permettre l'accès aux admins RH pour support</p>
                </div>
                <Switch
                  checked={settings.adminAccess}
                  onCheckedChange={() => handleToggle('adminAccess')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Services de géolocalisation</p>
                  <p className="text-sm text-muted-foreground">Utilisation de votre position pour des recommandations locales</p>
                </div>
                <Switch
                  checked={settings.locationServices}
                  onCheckedChange={() => handleToggle('locationServices')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Droits des Données</CardTitle>
              <CardDescription>Actions sur vos données personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir mes données
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Rapport de confidentialité
                </Button>
                
                <Button variant="destructive" className="justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mes données
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note RGPD :</strong> Vous avez le droit d'accéder, de rectifier, de supprimer ou de transférer vos données personnelles. 
                  Ces actions peuvent affecter le fonctionnement de certaines fonctionnalités.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTogglesPage;
