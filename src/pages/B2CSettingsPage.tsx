
/**
 * B2C SETTINGS PAGE - EMOTIONSCARE
 * Page des paramètres B2C accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
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

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "Paramètres | EmotionsCare - Personnalisation";
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

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
    <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" data-testid="page-root">
        <div className="max-w-4xl mx-auto space-y-6">
          <main id="main-content" role="main">
            {/* Header */}
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                <Settings className="inline-block mr-3 text-blue-600" aria-hidden="true" />
                Paramètres
              </h1>
              <p className="text-xl text-gray-600">
                Personnalisez votre expérience EmotionsCare
              </p>
            </header>

            {/* Paramètres par catégorie */}
            <div className="space-y-6">
              {settingsCategories.map((category, index) => (
                <section key={index} aria-labelledby={`category-${index}-title`}>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle id={`category-${index}-title`} className="flex items-center gap-3">
                        <div 
                          className="p-2 bg-blue-100 rounded-lg text-blue-600"
                          role="img"
                          aria-label={`Icône ${category.title}`}
                        >
                          {category.icon}
                        </div>
                        {category.title}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <fieldset className="space-y-4">
                        <legend className="sr-only">Paramètres {category.title}</legend>
                        {category.settings.map((setting) => (
                          <div 
                            key={setting.id} 
                            className="flex items-center justify-between p-4 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                          >
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{setting.label}</h3>
                              <p className="text-sm text-gray-600" id={`${setting.id}-desc`}>
                                {setting.description}
                              </p>
                            </div>
                            <Switch
                              checked={setting.value}
                              onCheckedChange={setting.onChange}
                              aria-labelledby={`${setting.id}-label`}
                              aria-describedby={`${setting.id}-desc`}
                              className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            />
                            <label 
                              id={`${setting.id}-label`}
                              htmlFor={setting.id}
                              className="sr-only"
                            >
                              {setting.label}
                            </label>
                          </div>
                        ))}
                      </fieldset>
                    </CardContent>
                  </Card>
                </section>
              ))}
            </div>

            {/* Préférences générales */}
            <section aria-labelledby="general-preferences-title">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle id="general-preferences-title" className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-600" aria-hidden="true" />
                    Préférences générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Langue</h3>
                      <p className="text-sm text-gray-600" id="language-desc">
                        Choisir la langue de l'interface
                      </p>
                    </div>
                    <Select defaultValue="fr" aria-describedby="language-desc">
                      <SelectTrigger className="w-32 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
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
                    <Badge variant="secondary" role="status" aria-label="Fuseau horaire actuel">
                      Europe/Paris
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Actions */}
            <nav aria-label="Actions des paramètres" className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Réinitialiser tous les paramètres aux valeurs par défaut"
                tabIndex={0}
              >
                Réinitialiser
              </Button>
              <Button 
                className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Sauvegarder toutes les modifications des paramètres"
                tabIndex={0}
              >
                Sauvegarder les modifications
              </Button>
            </nav>
          </main>
        </div>
      </div>
    </>
  );
};

export default B2CSettingsPage;
