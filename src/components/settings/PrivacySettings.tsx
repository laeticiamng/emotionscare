// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Eye, 
  Users, 
  Download,
  Trash2,
  Lock,
  Globe,
  AlertTriangle
} from 'lucide-react';

const PrivacySettings: React.FC = () => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [shareEmotionalData, setShareEmotionalData] = useState(false);
  const [allowAnalytics, setAllowAnalytics] = useState(true);
  const [teamVisibility, setTeamVisibility] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Visibilité du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visibilité du profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visibility">Profil public</Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux autres utilisateurs de voir votre profil
              </p>
            </div>
            <Switch
              id="profile-visibility"
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="team-visibility" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Visibilité en équipe
              </Label>
              <p className="text-sm text-muted-foreground">
                Être visible dans les interactions d'équipe
              </p>
            </div>
            <Switch
              id="team-visibility"
              checked={teamVisibility}
              onCheckedChange={setTeamVisibility}
            />
          </div>
        </CardContent>
      </Card>

      {/* Partage des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Partage des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="share-emotional-data">Données émotionnelles</Label>
              <p className="text-sm text-muted-foreground">
                Partager vos données émotionnelles anonymisées pour la recherche
              </p>
            </div>
            <Switch
              id="share-emotional-data"
              checked={shareEmotionalData}
              onCheckedChange={setShareEmotionalData}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-analytics">Données d'utilisation</Label>
              <p className="text-sm text-muted-foreground">
                Autoriser la collecte de données d'utilisation pour améliorer l'app
              </p>
            </div>
            <Switch
              id="allow-analytics"
              checked={allowAnalytics}
              onCheckedChange={setAllowAnalytics}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-collection">Collecte de données</Label>
              <p className="text-sm text-muted-foreground">
                Permettre la collecte de données pour personnaliser votre expérience
              </p>
            </div>
            <Switch
              id="data-collection"
              checked={dataCollection}
              onCheckedChange={setDataCollection}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Communications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Emails marketing</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des informations sur les nouvelles fonctionnalités
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestion des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Gestion des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Télécharger mes données
            </Button>
            <p className="text-sm text-muted-foreground">
              Obtenez une copie de toutes vos données personnelles
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                La suppression de votre compte est définitive et ne peut pas être annulée.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer mon compte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations RGPD */}
      <Card>
        <CardHeader>
          <CardTitle>Vos droits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Conformément au RGPD, vous avez le droit de :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier des données inexactes</li>
              <li>Demander l'effacement de vos données</li>
              <li>Limiter le traitement de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <Button variant="link" className="p-0 h-auto">
              En savoir plus sur notre politique de confidentialité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettings;
