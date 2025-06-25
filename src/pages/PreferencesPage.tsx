
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Settings, Bell, Volume2, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: {
      dailyReminders: true,
      emotionalCheckins: true,
      musicRecommendations: false,
      coachSuggestions: true
    },
    audio: {
      volume: 70,
      autoplay: false,
      fadeTransitions: true
    },
    appearance: {
      darkMode: false,
      animations: true,
      compactMode: false
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      personalizedAds: false
    }
  });

  const handleSave = () => {
    // Ici on sauvegarderait les préférences
    toast.success('Préférences sauvegardées avec succès !');
  };

  const updatePreference = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Préférences</h1>
          <p className="text-muted-foreground">Personnalisez votre expérience</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      <div className="space-y-6">
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
                <p className="font-medium">Rappels quotidiens</p>
                <p className="text-sm text-muted-foreground">
                  Recevez des rappels pour vos sessions quotidiennes
                </p>
              </div>
              <Switch
                checked={preferences.notifications.dailyReminders}
                onCheckedChange={(checked) => 
                  updatePreference('notifications', 'dailyReminders', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Check-ins émotionnels</p>
                <p className="text-sm text-muted-foreground">
                  Notifications pour évaluer votre état émotionnel
                </p>
              </div>
              <Switch
                checked={preferences.notifications.emotionalCheckins}
                onCheckedChange={(checked) => 
                  updatePreference('notifications', 'emotionalCheckins', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recommandations musicales</p>
                <p className="text-sm text-muted-foreground">
                  Nouvelles playlists adaptées à votre humeur
                </p>
              </div>
              <Switch
                checked={preferences.notifications.musicRecommendations}
                onCheckedChange={(checked) => 
                  updatePreference('notifications', 'musicRecommendations', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Suggestions du coach</p>
                <p className="text-sm text-muted-foreground">
                  Conseils personnalisés de votre coach virtuel
                </p>
              </div>
              <Switch
                checked={preferences.notifications.coachSuggestions}
                onCheckedChange={(checked) => 
                  updatePreference('notifications', 'coachSuggestions', checked)
                }
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
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Volume par défaut</p>
                <span className="text-sm text-muted-foreground">
                  {preferences.audio.volume}%
                </span>
              </div>
              <Slider
                value={[preferences.audio.volume]}
                onValueChange={(value) => 
                  updatePreference('audio', 'volume', value[0])
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lecture automatique</p>
                <p className="text-sm text-muted-foreground">
                  Commencer la musique automatiquement
                </p>
              </div>
              <Switch
                checked={preferences.audio.autoplay}
                onCheckedChange={(checked) => 
                  updatePreference('audio', 'autoplay', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Transitions en fondu</p>
                <p className="text-sm text-muted-foreground">
                  Transitions douces entre les pistes
                </p>
              </div>
              <Switch
                checked={preferences.audio.fadeTransitions}
                onCheckedChange={(checked) => 
                  updatePreference('audio', 'fadeTransitions', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-muted-foreground">
                  Interface avec thème sombre
                </p>
              </div>
              <Switch
                checked={preferences.appearance.darkMode}
                onCheckedChange={(checked) => 
                  updatePreference('appearance', 'darkMode', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-muted-foreground">
                  Effets visuels et transitions
                </p>
              </div>
              <Switch
                checked={preferences.appearance.animations}
                onCheckedChange={(checked) => 
                  updatePreference('appearance', 'animations', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode compact</p>
                <p className="text-sm text-muted-foreground">
                  Interface plus dense
                </p>
              </div>
              <Switch
                checked={preferences.appearance.compactMode}
                onCheckedChange={(checked) => 
                  updatePreference('appearance', 'compactMode', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Partage de données</p>
                <p className="text-sm text-muted-foreground">
                  Partager des données anonymes pour améliorer l'app
                </p>
              </div>
              <Switch
                checked={preferences.privacy.dataSharing}
                onCheckedChange={(checked) => 
                  updatePreference('privacy', 'dataSharing', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analyse d'utilisation</p>
                <p className="text-sm text-muted-foreground">
                  Nous aider à comprendre comment vous utilisez l'app
                </p>
              </div>
              <Switch
                checked={preferences.privacy.analytics}
                onCheckedChange={(checked) => 
                  updatePreference('privacy', 'analytics', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Publicités personnalisées</p>
                <p className="text-sm text-muted-foreground">
                  Recevoir du contenu adapté à vos intérêts
                </p>
              </div>
              <Switch
                checked={preferences.privacy.personalizedAds}
                onCheckedChange={(checked) => 
                  updatePreference('privacy', 'personalizedAds', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PreferencesPage;
