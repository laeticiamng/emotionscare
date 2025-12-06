/**
 * Music Settings Tab - Paramètres et préférences musicales
 * Inclut: notifications, qualité audio, données, confidentialité
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Bell,
  Volume2,
  Database,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MusicSettings {
  notifications: {
    enabled: boolean;
    soundNotifications: boolean;
    newRecommendations: boolean;
    weeklyDigest: boolean;
  };
  audio: {
    quality: 'low' | 'normal' | 'high' | 'lossless';
    volume: number;
    autoPlayNext: boolean;
    repeatMode: 'off' | 'one' | 'all';
  };
  privacy: {
    shareListeningData: boolean;
    showPublicProfile: boolean;
    allowCollaboration: boolean;
  };
  data: {
    downloadData: boolean;
    deleteData: boolean;
    cacheSize: string;
  };
}

interface MusicSettingsTabProps {
  initialSettings?: Partial<MusicSettings>;
  onSettingChange?: (setting: Partial<MusicSettings>) => void;
}

const DEFAULT_SETTINGS: MusicSettings = {
  notifications: {
    enabled: true,
    soundNotifications: true,
    newRecommendations: true,
    weeklyDigest: false,
  },
  audio: {
    quality: 'normal',
    volume: 80,
    autoPlayNext: true,
    repeatMode: 'off',
  },
  privacy: {
    shareListeningData: true,
    showPublicProfile: false,
    allowCollaboration: true,
  },
  data: {
    downloadData: false,
    deleteData: false,
    cacheSize: '125 MB',
  },
};

export const MusicSettingsTab: React.FC<MusicSettingsTabProps> = ({
  initialSettings = {},
  onSettingChange,
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<MusicSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });

  const handleSettingChange = (newSettings: Partial<MusicSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onSettingChange?.(newSettings);
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Paramètres sauvegardés ! ✓',
      description: 'Tes préférences musicales ont été mises à jour',
    });
  };

  const handleDownloadData = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      userSettings: {
        theme: localStorage.getItem('theme'),
        language: localStorage.getItem('language'),
      },
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data, null, 2))
    );
    element.setAttribute('download', `music-settings-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Données téléchargées 📥',
      description: 'Tes paramètres ont été exportés au format JSON',
    });
  };

  const handleClearCache = () => {
    localStorage.removeItem('music:favorites');
    localStorage.removeItem('music:history');
    localStorage.removeItem('music:lastPlayed');

    toast({
      title: 'Cache nettoyé ✓',
      description: 'Les données locales ont été supprimées',
    });
  };

  return (
    <div className="space-y-8">
      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Gère tes notifications musicales
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications activées</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir les alertes musicales
                </p>
              </div>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    notifications: { ...settings.notifications, enabled: checked },
                  })
                }
              />
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications sonores</p>
                <p className="text-sm text-muted-foreground">
                  Son pour les alertes
                </p>
              </div>
              <Switch
                checked={settings.notifications.soundNotifications}
                disabled={!settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    notifications: {
                      ...settings.notifications,
                      soundNotifications: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouvelles recommandations</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir les suggestions personnalisées
                </p>
              </div>
              <Switch
                checked={settings.notifications.newRecommendations}
                disabled={!settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    notifications: {
                      ...settings.notifications,
                      newRecommendations: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Résumé hebdomadaire</p>
                <p className="text-sm text-muted-foreground">
                  Récapitulatif de votre semaine musicale
                </p>
              </div>
              <Switch
                checked={settings.notifications.weeklyDigest}
                disabled={!settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    notifications: {
                      ...settings.notifications,
                      weeklyDigest: checked,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audio Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Qualité et options de lecture audio
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualité audio</label>
              <Select
                defaultValue={settings.audio.quality}
                onValueChange={(value) =>
                  handleSettingChange({
                    audio: {
                      ...settings.audio,
                      quality: value as 'low' | 'normal' | 'high' | 'lossless',
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Basse qualité (plus rapide)
                  </SelectItem>
                  <SelectItem value="normal">
                    Qualité normale (recommandée)
                  </SelectItem>
                  <SelectItem value="high">Haute qualité</SelectItem>
                  <SelectItem value="lossless">Lossless (meilleure)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Volume par défaut: {settings.audio.volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.volume}
                onChange={(e) =>
                  handleSettingChange({
                    audio: {
                      ...settings.audio,
                      volume: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mode de répétition</label>
              <Select
                defaultValue={settings.audio.repeatMode}
                onValueChange={(value) =>
                  handleSettingChange({
                    audio: {
                      ...settings.audio,
                      repeatMode: value as 'off' | 'one' | 'all',
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Pas de répétition</SelectItem>
                  <SelectItem value="one">Répéter un</SelectItem>
                  <SelectItem value="all">Répéter tous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lecture automatique suivante</p>
                <p className="text-sm text-muted-foreground">
                  Lancer la prochaine chanson automatiquement
                </p>
              </div>
              <Switch
                checked={settings.audio.autoPlayNext}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    audio: { ...settings.audio, autoPlayNext: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confidentialité
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Contrôle ta vie privée et tes données
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Partager mes données d'écoute</p>
                <p className="text-sm text-muted-foreground">
                  Aider à améliorer les recommandations
                </p>
              </div>
              <Switch
                checked={settings.privacy.shareListeningData}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    privacy: {
                      ...settings.privacy,
                      shareListeningData: checked,
                    },
                  })
                }
              />
            </div>

            <div className="border-t pt-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profil public</p>
                <p className="text-sm text-muted-foreground">
                  Autres utilisateurs peuvent voir ton profil
                </p>
              </div>
              <Switch
                checked={settings.privacy.showPublicProfile}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    privacy: {
                      ...settings.privacy,
                      showPublicProfile: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Collaboration musicale</p>
                <p className="text-sm text-muted-foreground">
                  Permettre les playlists collaboratives
                </p>
              </div>
              <Switch
                checked={settings.privacy.allowCollaboration}
                onCheckedChange={(checked) =>
                  handleSettingChange({
                    privacy: {
                      ...settings.privacy,
                      allowCollaboration: checked,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Données et stockage
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Gère tes données locales et préférences
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
              <div>
                <p className="font-medium">Cache local</p>
                <p className="text-sm text-muted-foreground">
                  {settings.data.cacheSize}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearCache}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Nettoyer
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleDownloadData}
              >
                <Download className="h-4 w-4" />
                Télécharger mes données
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                disabled
              >
                <Upload className="h-4 w-4" />
                Importer données
              </Button>
            </div>

            <div className="border-t pt-4" />

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="font-medium text-destructive mb-2">Zone de danger</p>
              <p className="text-sm text-muted-foreground mb-3">
                Cette action est irréversible
              </p>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => {
                  if (
                    confirm(
                      'Es-tu sûr ? Cette action supprimera toutes tes données musicales.'
                    )
                  ) {
                    toast({
                      title: 'Données supprimées',
                      description:
                        'Toutes tes données musicales ont été supprimées',
                    });
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer toutes mes données
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <Button onClick={handleSaveSettings} size="lg" className="w-full gap-2">
        <Save className="h-5 w-5" />
        Enregistrer les paramètres
      </Button>
    </div>
  );
};

export default MusicSettingsTab;
