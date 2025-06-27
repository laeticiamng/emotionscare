
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Users, BarChart3, Bell, Cookie } from 'lucide-react';
import { toast } from 'sonner';

const PrivacyTogglesPage: React.FC = () => {
  const [settings, setSettings] = useState({
    dataCollection: true,
    analytics: false,
    socialSharing: true,
    notifications: true,
    cookies: true,
    profileVisibility: false,
    emotionSharing: false,
    marketingEmails: false,
    thirdPartyIntegrations: true,
    dataRetention: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveSettings = () => {
    toast.success('Paramètres de confidentialité sauvegardés');
  };

  const privacyGroups = [
    {
      title: 'Collecte de Données',
      icon: Shield,
      description: 'Contrôlez quelles données nous collectons',
      settings: [
        {
          key: 'dataCollection' as keyof typeof settings,
          label: 'Collecte des données émotionnelles',
          description: 'Permet l\'analyse et les recommandations personnalisées'
        },
        {
          key: 'analytics' as keyof typeof settings,
          label: 'Données d\'usage anonymes',
          description: 'Aide à améliorer l\'application (données agrégées)'
        }
      ]
    },
    {
      title: 'Visibilité et Partage',
      icon: Eye,
      description: 'Gérez ce qui est visible par les autres',
      settings: [
        {
          key: 'profileVisibility' as keyof typeof settings,
          label: 'Profil public',
          description: 'Votre profil est visible par les autres utilisateurs'
        },
        {
          key: 'emotionSharing' as keyof typeof settings,
          label: 'Partage d\'émotions',
          description: 'Vos analyses peuvent être partagées (anonymisées)'
        },
        {
          key: 'socialSharing' as keyof typeof settings,
          label: 'Fonctionnalités sociales',
          description: 'Interactions avec d\'autres utilisateurs'
        }
      ]
    },
    {
      title: 'Communications',
      icon: Bell,
      description: 'Contrôlez les communications que vous recevez',
      settings: [
        {
          key: 'notifications' as keyof typeof settings,
          label: 'Notifications push',
          description: 'Rappels et alertes de bien-être'
        },
        {
          key: 'marketingEmails' as keyof typeof settings,
          label: 'Emails marketing',
          description: 'Nouveautés, conseils et offres spéciales'
        }
      ]
    },
    {
      title: 'Intégrations Techniques',
      icon: BarChart3,
      description: 'Services tiers et cookies',
      settings: [
        {
          key: 'cookies' as keyof typeof settings,
          label: 'Cookies analytiques',
          description: 'Cookies pour améliorer votre expérience'
        },
        {
          key: 'thirdPartyIntegrations' as keyof typeof settings,
          label: 'Intégrations tierces',
          description: 'Services comme Spotify, calendriers, etc.'
        },
        {
          key: 'dataRetention' as keyof typeof settings,
          label: 'Conservation des données',
          description: 'Stockage long terme pour l\'historique'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Paramètres de Confidentialité</h1>
        <p className="text-xl text-muted-foreground">
          Contrôlez précisément vos données et votre vie privée
        </p>
      </div>

      <div className="space-y-6">
        {privacyGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <group.icon className="h-5 w-5" />
                {group.title}
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="flex items-start justify-between space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={setting.key} className="text-base font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      id={setting.key}
                      checked={settings[setting.key]}
                      onCheckedChange={() => handleToggle(setting.key)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Transparence RGPD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <h4 className="font-medium mb-2">Vos Droits :</h4>
                <ul className="space-y-1">
                  <li>• Droit d'accès à vos données</li>
                  <li>• Droit de rectification</li>
                  <li>• Droit à l'effacement</li>
                  <li>• Droit à la portabilité</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Notre Engagement :</h4>
                <ul className="space-y-1">
                  <li>• Chiffrement bout en bout</li>
                  <li>• Données hébergées en UE</li>
                  <li>• Pas de vente de données</li>
                  <li>• Audit sécurité annuel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={saveSettings} size="lg">
            Sauvegarder les Paramètres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTogglesPage;
