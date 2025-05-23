
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Palette, Globe, Volume2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const settingSections = [
    {
      title: 'Notifications',
      description: 'Gérez vos préférences de notification',
      icon: Bell,
      color: 'bg-blue-500'
    },
    {
      title: 'Confidentialité',
      description: 'Contrôlez vos données personnelles',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'Apparence',
      description: 'Personnalisez l\'interface',
      icon: Palette,
      color: 'bg-purple-500'
    },
    {
      title: 'Langue',
      description: 'Choisissez votre langue préférée',
      icon: Globe,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <Settings className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Paramètres</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choisissez quand et comment recevoir les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notifications email</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Recevoir des emails pour les rappels importants
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notifications push</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Notifications en temps réel dans l'application
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="wellness-reminders">Rappels bien-être</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Rappels quotidiens pour vos sessions
                  </p>
                </div>
                <Switch id="wellness-reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Confidentialité et sécurité
              </CardTitle>
              <CardDescription>
                Contrôlez la confidentialité de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing">Partage de données anonymes</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Aider à améliorer nos services avec des données anonymisées
                  </p>
                </div>
                <Switch id="data-sharing" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Analyses d'utilisation</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Permettre l'analyse de votre utilisation pour des recommandations personnalisées
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Télécharger mes données
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Taille de police</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Audio
              </CardTitle>
              <CardDescription>
                Paramètres audio et musicothérapie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-play">Lecture automatique</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Démarrer automatiquement les recommandations musicales
                  </p>
                </div>
                <Switch id="auto-play" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label>Qualité audio</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="lossless">Sans perte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
