import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Shield, Palette, Volume2, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AppSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    dailyReminders: true,
    weeklyReports: false,
    dataSharing: false,
    autoScanSave: true,
    musicVolume: [75],
    theme: 'system',
    language: 'fr',
    voiceCoach: false,
    biometricAuth: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: 'Paramètre mis à jour',
      description: 'Vos préférences ont été sauvegardées.'
    });
  };

  const settingsSections = [
    {
      title: 'Profil utilisateur',
      icon: User,
      items: [
        {
          label: 'Nom d\'affichage',
          description: 'Comment vous apparaissez dans l\'application',
          type: 'text',
          value: 'Utilisateur'
        },
        {
          label: 'Email',
          description: 'Adresse email pour les notifications',
          type: 'email',
          value: 'user@example.com'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          key: 'notifications',
          label: 'Notifications push',
          description: 'Recevoir des notifications sur votre appareil',
          type: 'switch'
        },
        {
          key: 'dailyReminders',
          label: 'Rappels quotidiens',
          description: 'Rappel pour vos sessions de bien-être',
          type: 'switch'
        },
        {
          key: 'weeklyReports',
          label: 'Rapports hebdomadaires',
          description: 'Résumé de vos progrès chaque semaine',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Audio et sons',
      icon: Volume2,
      items: [
        {
          key: 'soundEffects',
          label: 'Effets sonores',
          description: 'Sons d\'interface et de feedback',
          type: 'switch'
        },
        {
          key: 'musicVolume',
          label: 'Volume musique',
          description: 'Volume par défaut pour la thérapie musicale',
          type: 'slider',
          min: 0,
          max: 100
        },
        {
          key: 'voiceCoach',
          label: 'Coach vocal',
          description: 'Instructions vocales pendant les exercices',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Apparence',
      icon: Palette,
      items: [
        {
          key: 'theme',
          label: 'Thème',
          description: 'Mode d\'affichage de l\'application',
          type: 'select',
          options: [
            { value: 'light', label: 'Clair' },
            { value: 'dark', label: 'Sombre' },
            { value: 'system', label: 'Système' }
          ]
        },
        {
          key: 'language',
          label: 'Langue',
          description: 'Langue de l\'interface',
          type: 'select',
          options: [
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' }
          ]
        }
      ]
    },
    {
      title: 'Confidentialité',
      icon: Shield,
      items: [
        {
          key: 'dataSharing',
          label: 'Partage de données',
          description: 'Partager des données anonymisées pour la recherche',
          type: 'switch'
        },
        {
          key: 'autoScanSave',
          label: 'Sauvegarde automatique',
          description: 'Sauvegarder automatiquement vos scans émotionnels',
          type: 'switch'
        },
        {
          key: 'biometricAuth',
          label: 'Authentification biométrique',
          description: 'Déverrouiller avec empreinte ou Face ID',
          type: 'switch'
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            checked={settings[item.key as keyof typeof settings] as boolean}
            onCheckedChange={(checked) => updateSetting(item.key, checked)}
          />
        );
      case 'slider':
        return (
          <div className="w-32">
            <Slider
              value={settings[item.key as keyof typeof settings] as number[]}
              onValueChange={(value) => updateSetting(item.key, value)}
              max={item.max || 100}
              min={item.min || 0}
              step={1}
            />
          </div>
        );
      case 'select':
        return (
          <Select
            value={settings[item.key as keyof typeof settings] as string}
            onValueChange={(value) => updateSetting(item.key, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {item.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <span className="text-sm text-muted-foreground">
            {item.value}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Personnalisez votre expérience EmotionsCare</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="ml-4">
                          {renderSettingItem(item)}
                        </div>
                      </div>
                      {itemIndex < section.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zone de danger</CardTitle>
              <CardDescription>Actions irréversibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Effacer toutes les données</p>
                    <p className="text-sm text-muted-foreground">
                      Supprime définitivement tous vos scans, paramètres et historique
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Effacer
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Supprimer le compte</p>
                    <p className="text-sm text-muted-foreground">
                      Supprime votre compte et toutes les données associées
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => toast({
                title: 'Paramètres sauvegardés',
                description: 'Toutes vos préférences ont été mises à jour.'
              })}
            >
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;