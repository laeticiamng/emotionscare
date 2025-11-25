// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bell,
  BellOff,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Music,
  Heart,
  Trophy,
  Users,
  Calendar,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  Send,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'browser';
  lastActive: Date;
  enabled: boolean;
  browser?: string;
  os?: string;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  priority: 'low' | 'normal' | 'high';
  sound: boolean;
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: number[];
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    lastActive: new Date(Date.now() - 1000 * 60 * 5),
    enabled: true,
    os: 'iOS 17',
  },
  {
    id: '2',
    name: 'MacBook Pro',
    type: 'desktop',
    lastActive: new Date(),
    enabled: true,
    browser: 'Chrome',
    os: 'macOS 14',
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    enabled: false,
    os: 'iPadOS 17',
  },
];

const defaultCategories: NotificationCategory[] = [
  {
    id: 'music_recommendations',
    name: 'Recommandations musicales',
    description: 'Nouvelles suggestions basées sur votre humeur',
    icon: Music,
    enabled: true,
    priority: 'normal',
    sound: true,
  },
  {
    id: 'mood_insights',
    name: 'Insights émotionnels',
    description: 'Analyses et tendances de votre bien-être',
    icon: Heart,
    enabled: true,
    priority: 'normal',
    sound: false,
  },
  {
    id: 'achievements',
    name: 'Succès et badges',
    description: 'Nouveaux accomplissements débloqués',
    icon: Trophy,
    enabled: true,
    priority: 'high',
    sound: true,
  },
  {
    id: 'social',
    name: 'Activité sociale',
    description: 'Interactions et invitations de la communauté',
    icon: Users,
    enabled: false,
    priority: 'low',
    sound: false,
  },
  {
    id: 'reminders',
    name: 'Rappels bien-être',
    description: 'Rappels pour vos sessions et routines',
    icon: Calendar,
    enabled: true,
    priority: 'normal',
    sound: true,
  },
  {
    id: 'challenges',
    name: 'Défis et événements',
    description: 'Nouveaux défis et événements disponibles',
    icon: Zap,
    enabled: true,
    priority: 'normal',
    sound: false,
  },
];

const defaultQuietHours: QuietHours = {
  enabled: true,
  startTime: '22:00',
  endTime: '08:00',
  days: [0, 1, 2, 3, 4, 5, 6],
};

const daysOfWeek = [
  { value: 0, label: 'Dim', fullLabel: 'Dimanche' },
  { value: 1, label: 'Lun', fullLabel: 'Lundi' },
  { value: 2, label: 'Mar', fullLabel: 'Mardi' },
  { value: 3, label: 'Mer', fullLabel: 'Mercredi' },
  { value: 4, label: 'Jeu', fullLabel: 'Jeudi' },
  { value: 5, label: 'Ven', fullLabel: 'Vendredi' },
  { value: 6, label: 'Sam', fullLabel: 'Samedi' },
];

export const PushNotificationManager: React.FC = () => {
  const { toast } = useToast();
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default'>('default');
  const [isEnabled, setIsEnabled] = useState(true);
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [categories, setCategories] = useState<NotificationCategory[]>(defaultCategories);
  const [quietHours, setQuietHours] = useState<QuietHours>(defaultQuietHours);
  const [soundVolume, setSoundVolume] = useState(70);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission as 'granted' | 'denied' | 'default');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission as 'granted' | 'denied' | 'default');

      if (permission === 'granted') {
        toast({
          title: 'Notifications activées',
          description: 'Vous recevrez désormais des notifications push.',
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Notifications bloquées',
          description: 'Veuillez activer les notifications dans les paramètres de votre navigateur.',
          variant: 'destructive',
        });
      }
    }
  };

  const toggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, enabled: !device.enabled } : device
      )
    );
  };

  const removeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
    toast({
      title: 'Appareil supprimé',
      description: 'L\'appareil ne recevra plus de notifications.',
    });
  };

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const updateCategoryPriority = (categoryId: string, priority: 'low' | 'normal' | 'high') => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, priority } : cat
      )
    );
  };

  const toggleCategorySound = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, sound: !cat.sound } : cat
      )
    );
  };

  const toggleQuietHoursDay = (day: number) => {
    setQuietHours((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const sendTestNotification = async () => {
    setIsSending(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if ('Notification' in window && permissionStatus === 'granted') {
        new Notification('Test EmotionsCare', {
          body: 'Ceci est une notification de test. Tout fonctionne correctement!',
          icon: '/favicon.ico',
        });
      }

      toast({
        title: 'Notification envoyée',
        description: 'Une notification de test a été envoyée à vos appareils.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'desktop':
        return Monitor;
      case 'tablet':
        return Tablet;
      case 'browser':
        return Laptop;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Haute</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normale</Badge>;
      case 'low':
        return <Badge variant="outline">Basse</Badge>;
    }
  };

  const enabledDevicesCount = devices.filter((d) => d.enabled).length;
  const enabledCategoriesCount = categories.filter((c) => c.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header with Master Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                {isEnabled ? (
                  <Bell className="h-6 w-6 text-primary" />
                ) : (
                  <BellOff className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle>Notifications Push</CardTitle>
                <CardDescription>
                  Gérez comment et quand vous recevez des notifications
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isEnabled ? 'Activées' : 'Désactivées'}
              </span>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Permission Status */}
      {permissionStatus !== 'granted' && (
        <Card className={permissionStatus === 'denied' ? 'border-destructive' : 'border-yellow-500'}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {permissionStatus === 'denied' ? (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                ) : (
                  <Info className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">
                    {permissionStatus === 'denied'
                      ? 'Notifications bloquées'
                      : 'Permission requise'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {permissionStatus === 'denied'
                      ? 'Modifiez les paramètres de votre navigateur pour activer les notifications'
                      : 'Autorisez les notifications pour recevoir des alertes en temps réel'}
                  </p>
                </div>
              </div>
              {permissionStatus === 'default' && (
                <Button onClick={requestPermission}>
                  Autoriser
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Devices */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Smartphone className="h-5 w-5" />
                      Appareils connectés
                    </CardTitle>
                    <CardDescription>
                      {enabledDevicesCount} appareil(s) actif(s) sur {devices.length}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {devices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <div
                      key={device.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        device.enabled ? 'border-primary/30 bg-primary/5' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${device.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                          <DeviceIcon className={`h-5 w-5 ${device.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{device.name}</span>
                            {device.lastActive.getTime() > Date.now() - 1000 * 60 * 10 && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                En ligne
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{device.os}</span>
                            {device.browser && (
                              <>
                                <span>•</span>
                                <span>{device.browser}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{getTimeAgo(device.lastActive)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={device.enabled}
                          onCheckedChange={() => toggleDevice(device.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {devices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Smartphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun appareil connecté</p>
                    <p className="text-sm">Les appareils apparaîtront ici une fois connectés</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="h-5 w-5" />
                      Catégories de notifications
                    </CardTitle>
                    <CardDescription>
                      {enabledCategoriesCount} catégorie(s) activée(s) sur {categories.length}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        category.enabled ? 'border-primary/30 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className={`h-5 w-5 ${category.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={category.enabled}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                      </div>

                      {category.enabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-4 pt-3 border-t"
                        >
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Priorité:</Label>
                            <Select
                              value={category.priority}
                              onValueChange={(value: any) => updateCategoryPriority(category.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Basse</SelectItem>
                                <SelectItem value="normal">Normale</SelectItem>
                                <SelectItem value="high">Haute</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                          <div className="flex items-center gap-2">
                            <Button
                              variant={category.sound ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleCategorySound(category.id)}
                            >
                              {category.sound ? (
                                <Volume2 className="h-4 w-4 mr-1" />
                              ) : (
                                <VolumeX className="h-4 w-4 mr-1" />
                              )}
                              Son
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sound Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="h-5 w-5" />
                  Paramètres sonores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Volume des notifications</Label>
                    <span className="text-sm text-muted-foreground">{soundVolume}%</span>
                  </div>
                  <Slider
                    value={[soundVolume]}
                    onValueChange={([value]) => setSoundVolume(value)}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Son par défaut
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Music className="h-4 w-4 mr-2" />
                    Son personnalisé
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5" />
                      Heures silencieuses
                    </CardTitle>
                    <CardDescription>
                      Désactivez les notifications pendant certaines heures
                    </CardDescription>
                  </div>
                  <Switch
                    checked={quietHours.enabled}
                    onCheckedChange={(checked) =>
                      setQuietHours((prev) => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>
              </CardHeader>
              {quietHours.enabled && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Début</Label>
                      <input
                        type="time"
                        value={quietHours.startTime}
                        onChange={(e) =>
                          setQuietHours((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fin</Label>
                      <input
                        type="time"
                        value={quietHours.endTime}
                        onChange={(e) =>
                          setQuietHours((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Jours actifs</Label>
                    <div className="flex gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day.value}
                          variant={quietHours.days.includes(day.value) ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleQuietHoursDay(day.value)}
                          title={day.fullLabel}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Les notifications de haute priorité passeront quand même pendant les heures silencieuses
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Test & Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={sendTestNotification}
                disabled={isSending || permissionStatus !== 'granted'}
                className="flex-1 min-w-[200px]"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Envoi...' : 'Envoyer une notification test'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[200px]"
                onClick={() => {
                  setCategories(defaultCategories);
                  setQuietHours(defaultQuietHours);
                  toast({
                    title: 'Paramètres réinitialisés',
                    description: 'Les paramètres par défaut ont été restaurés.',
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button className="flex-1 min-w-[200px]">
                <CheckCircle className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disabled State */}
      {!isEnabled && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Les notifications push sont désactivées
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Activez-les pour recevoir des alertes en temps réel
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PushNotificationManager;
