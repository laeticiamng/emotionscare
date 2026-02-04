/**
 * Paramètres de notifications
 * Configuration des préférences de notifications
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Clock,
  Trophy,
  Users,
  Megaphone,
  Settings
} from 'lucide-react';
import type { NotificationPreferences } from '../types';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onChange: (preferences: NotificationPreferences) => void;
}

export function NotificationSettings({ preferences, onChange }: NotificationSettingsProps) {
  const updateChannel = (channel: keyof NotificationPreferences['channels'], value: boolean) => {
    onChange({
      ...preferences,
      channels: { ...preferences.channels, [channel]: value }
    });
  };

  const updateCategory = (category: keyof NotificationPreferences['categories'], value: boolean) => {
    onChange({
      ...preferences,
      categories: { ...preferences.categories, [category]: value }
    });
  };

  const updateQuietHours = (field: keyof NotificationPreferences['quietHours'], value: string | boolean) => {
    onChange({
      ...preferences,
      quietHours: { ...preferences.quietHours, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Activez ou désactivez toutes les notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-enabled" className="font-medium">
              Activer les notifications
            </Label>
            <Switch
              id="notifications-enabled"
              checked={preferences.enabled}
              onCheckedChange={(enabled) => onChange({ ...preferences, enabled })}
              aria-label="Activer les notifications"
            />
          </div>
        </CardContent>
      </Card>

      {preferences.enabled && (
        <>
          {/* Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Canaux de notification</CardTitle>
              <CardDescription>
                Choisissez comment recevoir vos notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Notifications push</Label>
                    <p className="text-xs text-muted-foreground">
                      Alertes sur votre appareil
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.channels.push}
                  onCheckedChange={(value) => updateChannel('push', value)}
                  aria-label="Notifications push"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Emails</Label>
                    <p className="text-xs text-muted-foreground">
                      Résumés et alertes importantes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.channels.email}
                  onCheckedChange={(value) => updateChannel('email', value)}
                  aria-label="Notifications email"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">In-app</Label>
                    <p className="text-xs text-muted-foreground">
                      Dans l'application
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.channels.inApp}
                  onCheckedChange={(value) => updateChannel('inApp', value)}
                  aria-label="Notifications in-app"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Types de notifications</CardTitle>
              <CardDescription>
                Personnalisez les notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Rappels</Label>
                    <p className="text-xs text-muted-foreground">
                      Sessions planifiées et objectifs
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.categories.reminders}
                  onCheckedChange={(value) => updateCategory('reminders', value)}
                  aria-label="Rappels"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Succès</Label>
                    <p className="text-xs text-muted-foreground">
                      Badges et récompenses débloqués
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.categories.achievements}
                  onCheckedChange={(value) => updateCategory('achievements', value)}
                  aria-label="Succès"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Social</Label>
                    <p className="text-xs text-muted-foreground">
                      Messages et activités communautaires
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.categories.social}
                  onCheckedChange={(value) => updateCategory('social', value)}
                  aria-label="Social"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Marketing</Label>
                    <p className="text-xs text-muted-foreground">
                      Offres et nouveautés
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.categories.marketing}
                  onCheckedChange={(value) => updateCategory('marketing', value)}
                  aria-label="Marketing"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Système</Label>
                    <p className="text-xs text-muted-foreground">
                      Sécurité et mises à jour importantes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.categories.system}
                  onCheckedChange={(value) => updateCategory('system', value)}
                  aria-label="Système"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mode silencieux</CardTitle>
              <CardDescription>
                Définissez des heures pendant lesquelles vous ne recevrez pas de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours-enabled" className="font-medium">
                  Activer le mode silencieux
                </Label>
                <Switch
                  id="quiet-hours-enabled"
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(value) => updateQuietHours('enabled', value)}
                  aria-label="Mode silencieux"
                />
              </div>

              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Début</Label>
                    <Input
                      id="quiet-start"
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updateQuietHours('start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">Fin</Label>
                    <Input
                      id="quiet-end"
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updateQuietHours('end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fréquence</CardTitle>
              <CardDescription>
                À quelle fréquence souhaitez-vous recevoir les notifications non urgentes ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={preferences.frequency}
                onValueChange={(value: NotificationPreferences['frequency']) => 
                  onChange({ ...preferences, frequency: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Temps réel</SelectItem>
                  <SelectItem value="hourly">Résumé horaire</SelectItem>
                  <SelectItem value="daily">Résumé quotidien</SelectItem>
                  <SelectItem value="weekly">Résumé hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
