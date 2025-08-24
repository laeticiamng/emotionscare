
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Shield, Palette, Clock, Volume2, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

const B2BUserPreferences: React.FC = () => {
  const [notifications, setNotifications] = useState({
    sessions: true,
    challenges: true,
    team: false,
    reminders: true
  });

  const [privacy, setPrivacy] = useState({
    shareProgress: false,
    visibleToTeam: true,
    anonymousData: true
  });

  const [audio, setAudio] = useState([70]);
  const [theme, setTheme] = useState('auto');
  const [workHours, setWorkHours] = useState({ start: '09:00', end: '18:00' });

  const handleSave = () => {
    toast.success('Préférences sauvegardées avec succès');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Préférences Professionnelles</h1>
        <p className="text-muted-foreground">
          Personnalisez votre espace de travail et vos paramètres de confidentialité.
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="schedule">Horaires</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Choisissez quand et comment recevoir les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sessions">Sessions de bien-être</Label>
                  <p className="text-sm text-muted-foreground">
                    Rappels pour vos sessions programmées
                  </p>
                </div>
                <Switch
                  id="sessions"
                  checked={notifications.sessions}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sessions: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="challenges">Défis et récompenses</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications sur vos achievements et nouveaux défis
                  </p>
                </div>
                <Switch
                  id="challenges"
                  checked={notifications.challenges}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, challenges: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="team">Activités d'équipe</Label>
                  <p className="text-sm text-muted-foreground">
                    Invitations et mises à jour des défis d'équipe
                  </p>
                </div>
                <Switch
                  id="team"
                  checked={notifications.team}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, team: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reminders">Rappels de pause</Label>
                  <p className="text-sm text-muted-foreground">
                    Suggestions de pauses bien-être pendant le travail
                  </p>
                </div>
                <Switch
                  id="reminders"
                  checked={notifications.reminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, reminders: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de confidentialité
              </CardTitle>
              <CardDescription>
                Contrôlez la visibilité de vos données au sein de l'entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="progress">Partager ma progression</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre à l'équipe de voir mes statistiques générales
                  </p>
                </div>
                <Switch
                  id="progress"
                  checked={privacy.shareProgress}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, shareProgress: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="visible">Visible dans l'équipe</Label>
                  <p className="text-sm text-muted-foreground">
                    Apparaître dans les listes de participants aux défis
                  </p>
                </div>
                <Switch
                  id="visible"
                  checked={privacy.visibleToTeam}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, visibleToTeam: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="anonymous">Données anonymisées</Label>
                  <p className="text-sm text-muted-foreground">
                    Contribuer aux statistiques générales de manière anonyme
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={privacy.anonymousData}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, anonymousData: checked }))
                  }
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Note importante</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vos conversations avec le coach IA restent toujours confidentielles 
                  et ne sont jamais partagées avec votre entreprise.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence et interface
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre espace de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="auto">Automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume audio ({audio[0]}%)
                </Label>
                <Slider
                  value={audio}
                  onValueChange={setAudio}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="animations">Animations réduites</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactiver les animations pour une meilleure accessibilité
                  </p>
                </div>
                <Switch id="animations" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horaires de travail
              </CardTitle>
              <CardDescription>
                Définissez vos heures de travail pour des suggestions adaptées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Select 
                    value={workHours.start} 
                    onValueChange={(value) => 
                      setWorkHours(prev => ({ ...prev, start: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Select 
                    value={workHours.end} 
                    onValueChange={(value) => 
                      setWorkHours(prev => ({ ...prev, end: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weekend">Mode week-end</Label>
                  <p className="text-sm text-muted-foreground">
                    Suggestions de bien-être adaptées au week-end
                  </p>
                </div>
                <Switch id="weekend" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Sauvegarder les préférences
        </Button>
      </div>
    </div>
  );
};

export default B2BUserPreferences;
