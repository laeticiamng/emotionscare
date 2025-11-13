import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page de gestion des notifications
 */
export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [reminderNotifications, setReminderNotifications] = React.useState(true);
  const [socialNotifications, setSocialNotifications] = React.useState(true);
  const [weeklyReports, setWeeklyReports] = React.useState(true);

  const handleSave = () => {
    toast.success('Préférences de notifications sauvegardées');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos préférences de notifications pour rester informé
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications par email
            </CardTitle>
            <CardDescription>
              Recevez des mises à jour importantes par email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex-1">
                Activer les notifications par email
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports" className="flex-1">
                Rapports hebdomadaires
              </Label>
              <Switch
                id="weekly-reports"
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications push
            </CardTitle>
            <CardDescription>
              Recevez des notifications instantanées sur votre appareil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex-1">
                Activer les notifications push
              </Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rappels
            </CardTitle>
            <CardDescription>
              Recevez des rappels pour vos activités et objectifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-notifications" className="flex-1">
                Rappels quotidiens
              </Label>
              <Switch
                id="reminder-notifications"
                checked={reminderNotifications}
                onCheckedChange={setReminderNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Social
            </CardTitle>
            <CardDescription>
              Notifications pour les interactions sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="social-notifications" className="flex-1">
                Messages et interactions
              </Label>
              <Switch
                id="social-notifications"
                checked={socialNotifications}
                onCheckedChange={setSocialNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
          <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Les notifications critiques de sécurité et les alertes système ne peuvent pas être désactivées.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder les préférences
          </Button>
        </div>
      </div>
    </div>
  );
}
