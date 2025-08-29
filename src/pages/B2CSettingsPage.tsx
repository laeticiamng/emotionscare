
/**
 * Page des paramètres B2C
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Eye, Shield, Palette, Heart } from "lucide-react";

const B2CSettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  const settingsCategories = [
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      description: "Gérez vos préférences de notifications",
      settings: [
        {
          id: "push-notifications",
          label: "Notifications push",
          description: "Recevoir des notifications sur votre appareil",
          value: notifications,
          onChange: setNotifications
        },
        {
          id: "email-notifications", 
          label: "Notifications email",
          description: "Recevoir des résumés par email",
          value: false,
          onChange: () => {}
        }
      ]
    },
    {
      title: "Apparence",
      icon: <Palette className="w-5 h-5" />,
      description: "Personnalisez l'interface utilisateur",
      settings: [
        {
          id: "dark-mode",
          label: "Mode sombre",
          description: "Utiliser le thème sombre",
          value: darkMode,
          onChange: setDarkMode
        }
      ]
    },
    {
      title: "Émotions & Scan",
      icon: <Heart className="w-5 h-5" />,
      description: "Paramètres de reconnaissance émotionnelle",
      settings: [
        {
          id: "auto-scan",
          label: "Scan automatique",
          description: "Scanner vos émotions automatiquement",
          value: autoScan,
          onChange: setAutoScan
        }
      ]
    },
    {
      title: "Confidentialité",
      icon: <Shield className="w-5 h-5" />,
      description: "Contrôlez vos données personnelles",
      settings: [
        {
          id: "privacy-mode",
          label: "Mode privé",
          description: "Anonymiser vos données",
          value: privacyMode,
          onChange: setPrivacyMode
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Settings className="inline-block mr-3 text-blue-600" />
            Paramètres
          </h1>
          <p className="text-xl text-gray-600">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>

        {/* Paramètres par catégorie */}
        <div className="space-y-6">
          {settingsCategories.map((category, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {category.icon}
                  </div>
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{setting.label}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <Switch
                        checked={setting.value}
                        onCheckedChange={setting.onChange}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Préférences générales */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-600" />
              Préférences générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Langue</h3>
                <p className="text-sm text-gray-600">Choisir la langue de l'interface</p>
              </div>
              <Select defaultValue="fr">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Fuseau horaire</h3>
                <p className="text-sm text-gray-600">Votre fuseau horaire local</p>
              </div>
              <Badge variant="secondary">Europe/Paris</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline">Réinitialiser</Button>
          <Button>Sauvegarder les modifications</Button>
        </div>
      </div>
    </div>
  );
};

export default B2CSettingsPage;
