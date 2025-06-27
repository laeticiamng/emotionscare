
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Bell, 
  Palette, 
  Volume2, 
  Shield, 
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Eye
} from 'lucide-react';

const PreferencesPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [privateMode, setPrivateMode] = useState(false);
  const [language, setLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const themes = [
    { id: 'light', name: 'Clair', icon: Sun, gradient: 'from-blue-400 to-blue-500' },
    { id: 'dark', name: 'Sombre', icon: Moon, gradient: 'from-gray-700 to-gray-800' },
    { id: 'nature', name: 'Nature', icon: Eye, gradient: 'from-green-400 to-green-500' },
    { id: 'sunset', name: 'Coucher de soleil', icon: Sun, gradient: 'from-orange-400 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Préférences
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Personnalisez votre expérience EmotionsCare
          </p>
        </div>

        <div className="space-y-6">
          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode sombre */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mode sombre</h3>
                  <p className="text-sm text-gray-600">Utilisez le thème sombre pour réduire la fatigue oculaire</p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              {/* Thèmes */}
              <div>
                <h3 className="font-medium mb-3">Thème de couleur</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {themes.map((theme) => {
                    const IconComponent = theme.icon;
                    return (
                      <button
                        key={theme.id}
                        className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className={`w-full h-12 bg-gradient-to-r ${theme.gradient} rounded mb-2`}></div>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm">{theme.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications générales</h3>
                  <p className="text-sm text-gray-600">Recevez des rappels et des mises à jour</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Notifications par email</h3>
                    <p className="text-sm text-gray-600">Recevez des emails de suivi</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  disabled={!notifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <div>
                    <h3 className="font-medium">Notifications push</h3>
                    <p className="text-sm text-gray-600">Recevez des notifications sur votre appareil</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  disabled={!notifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sons activés</h3>
                  <p className="text-sm text-gray-600">Jouer les sons d'interface et de méditation</p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              {soundEnabled && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Volume général</h3>
                    <span className="text-sm text-gray-600">{volume[0]}%</span>
                  </div>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Langue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Langue et région
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      language === lang.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="text-sm font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Mode privé</h3>
                  <p className="text-sm text-gray-600">Masquer votre activité dans les classements</p>
                </div>
                <Switch
                  checked={privateMode}
                  onCheckedChange={setPrivateMode}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Gestion des données</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Contrôlez vos données personnelles et votre vie privée
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Exporter mes données
                  </Button>
                  <Button variant="outline" size="sm">
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">
              Annuler
            </Button>
            <Button>
              Sauvegarder les préférences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
