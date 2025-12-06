/**
 * SecuritySettingsPage - Paramètres de sécurité du compte
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Key, Smartphone, AlertTriangle } from 'lucide-react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { toast } from 'sonner';

const SecuritySettingsPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [sessionAlerts, setSessionAlerts] = React.useState(true);

  usePageSEO({
    title: 'Sécurité du compte - EmotionsCare',
    description: 'Gérez la sécurité de votre compte EmotionsCare.',
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mot de passe mis à jour avec succès');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      {/* Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" aria-hidden="true" />
            Changer le mot de passe
          </CardTitle>
          <CardDescription>
            Mettez à jour votre mot de passe régulièrement pour plus de sécurité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit">Mettre à jour</Button>
          </form>
        </CardContent>
      </Card>

      {/* Double authentification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" aria-hidden="true" />
            Authentification à deux facteurs
          </CardTitle>
          <CardDescription>
            Ajoutez une couche de sécurité supplémentaire à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activer la 2FA</p>
              <p className="text-sm text-muted-foreground">
                Utilisez une application d'authentification
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
              aria-label="Activer l'authentification à deux facteurs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alertes de session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" aria-hidden="true" />
            Alertes de sécurité
          </CardTitle>
          <CardDescription>
            Recevez des notifications en cas d'activité suspecte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertes de connexion</p>
              <p className="text-sm text-muted-foreground">
                Notification lors d'une nouvelle connexion
              </p>
            </div>
            <Switch
              checked={sessionAlerts}
              onCheckedChange={setSessionAlerts}
              aria-label="Activer les alertes de connexion"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessions actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            Sessions actives
          </CardTitle>
          <CardDescription>
            Gérez les appareils connectés à votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Cet appareil</p>
                <p className="text-sm text-muted-foreground">Dernière activité : Maintenant</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Actif</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Déconnecter toutes les autres sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettingsPage;
