
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Clock } from 'lucide-react';
import { NotificationFrequency, NotificationTone, NotificationType } from '@/types/notification';

const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [frequency, setFrequency] = useState<NotificationFrequency>(NotificationFrequency.DAILY);
  const [type, setType] = useState<NotificationType>(NotificationType.ALL);
  const [tone, setTone] = useState<NotificationTone>(NotificationTone.GENTLE);
  const [volume, setVolume] = useState(70);
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleSave = () => {
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Préférences de notifications
        </CardTitle>
        <CardDescription>
          Personnalisez la façon dont vous souhaitez être informé des mises à jour et rappels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation des notifications */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label className="text-base">Notifications</Label>
            <div className="text-sm text-muted-foreground">
              Activez ou désactivez toutes les notifications
            </div>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        {notificationsEnabled && (
          <div className="space-y-6">
            {/* Types de notifications */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Types de rappels</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="journal" className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Journal émotionnel
                  </Label>
                  <Switch id="journal" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="breathing" className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Exercices de respiration
                  </Label>
                  <Switch id="breathing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="music" className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Suggestions musicales
                  </Label>
                  <Switch id="music" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="coach" className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Coach IA
                  </Label>
                  <Switch id="coach" defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            {/* Fréquence */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Fréquence</h3>
              </div>
              <RadioGroup 
                value={frequency} 
                onValueChange={(val) => setFrequency(val as NotificationFrequency)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value={NotificationFrequency.DAILY} id="frequency-daily" />
                  <Label htmlFor="frequency-daily" className="cursor-pointer">Quotidienne</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value={NotificationFrequency.WEEKLY} id="frequency-weekly" />
                  <Label htmlFor="frequency-weekly" className="cursor-pointer">Hebdomadaire</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value={NotificationFrequency.FLEXIBLE} id="frequency-flexible" />
                  <Label htmlFor="frequency-flexible" className="cursor-pointer">Flexible</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value={NotificationFrequency.NONE} id="frequency-none" />
                  <Label htmlFor="frequency-none" className="cursor-pointer">Aucune</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email notifications */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications par email</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevez des notifications par email en plus des notifications dans l'application
                  </div>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Tonalité */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Tonalité des messages</h3>
              <Select 
                value={tone} 
                onValueChange={(val) => setTone(val as NotificationTone)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NotificationTone.MINIMALIST}>Minimaliste</SelectItem>
                  <SelectItem value={NotificationTone.POETIC}>Poétique</SelectItem>
                  <SelectItem value={NotificationTone.DIRECTIVE}>Directif</SelectItem>
                  <SelectItem value={NotificationTone.MOTIVATING}>Motivant</SelectItem>
                  <SelectItem value={NotificationTone.GENTLE}>Doux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">Volume des notifications</h3>
                <span className="text-sm">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={10}
                onValueChange={(val) => setVolume(val[0])}
              />
            </div>

            {/* Horaires */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Heure de rappel préférée</h3>
              <Input 
                type="time" 
                value={reminderTime} 
                onChange={e => setReminderTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Nous enverrons les notifications quotidiennes à cette heure.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Annuler</Button>
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
