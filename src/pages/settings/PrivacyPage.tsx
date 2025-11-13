import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Download, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page de gestion de la confidentialité et RGPD
 */
export default function PrivacyPage() {
  const [dataSharing, setDataSharing] = React.useState(false);
  const [analyticsTracking, setAnalyticsTracking] = React.useState(true);
  const [profileVisibility, setProfileVisibility] = React.useState('friends');

  const handleExportData = () => {
    toast.success('Export de vos données en cours...');
  };

  const handleDeleteAccount = () => {
    toast.error('Fonctionnalité en cours de développement');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Confidentialité & Données
        </h1>
        <p className="text-muted-foreground mt-2">
          Contrôlez vos données personnelles et votre confidentialité
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visibilité du profil
            </CardTitle>
            <CardDescription>
              Contrôlez qui peut voir votre profil et vos activités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Qui peut voir mon profil ?</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
              >
                <option value="public">Public - Tout le monde</option>
                <option value="friends">Amis uniquement</option>
                <option value="private">Privé - Personne</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partage de données</CardTitle>
            <CardDescription>
              Gérez comment vos données sont utilisées pour améliorer l'expérience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing" className="flex-1">
                Partager mes données anonymisées pour la recherche
              </Label>
              <Switch
                id="data-sharing"
                checked={dataSharing}
                onCheckedChange={setDataSharing}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="flex-1">
                Autoriser le suivi analytique
              </Label>
              <Switch
                id="analytics"
                checked={analyticsTracking}
                onCheckedChange={setAnalyticsTracking}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportation de données (RGPD)
            </CardTitle>
            <CardDescription>
              Téléchargez une copie de toutes vos données personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exporter mes données
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Vous recevrez un fichier ZIP contenant toutes vos données dans les 48h.
            </p>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Zone dangereuse
            </CardTitle>
            <CardDescription>
              Actions irréversibles concernant votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-4 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Supprimer mon compte
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement mon compte
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Annuler
          </Button>
          <Button onClick={() => toast.success('Préférences sauvegardées')}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
