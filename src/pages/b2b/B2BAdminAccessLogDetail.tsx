import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Shield, MapPin } from 'lucide-react';

const B2BAdminAccessLogDetail: React.FC = () => {
  const { logId } = useParams();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux logs
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détail du Log #{logId}</h1>
          <p className="text-muted-foreground">
            Informations détaillées de l'accès
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horodatage</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14:32:18</div>
            <p className="text-xs text-muted-foreground">18 Juin 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateur</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Marie D.</div>
            <p className="text-xs text-muted-foreground">marie.dupont@techcorp.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">LOGIN</div>
            <p className="text-xs text-muted-foreground">Connexion réussie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Localisation</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Paris</div>
            <p className="text-xs text-muted-foreground">France, Europe</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Adresse IP</label>
                  <p className="text-sm text-muted-foreground">192.168.1.45</p>
                </div>
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <p className="text-sm text-muted-foreground">Chrome 120.0.0.0</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Système</label>
                  <p className="text-sm text-muted-foreground">Windows 11</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Appareil</label>
                  <p className="text-sm text-muted-foreground">Desktop</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Session ID</label>
                  <p className="text-sm text-muted-foreground font-mono">sess_abc123def456</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Durée session</label>
                  <p className="text-sm text-muted-foreground">2h 34min</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Référent</label>
                  <p className="text-sm text-muted-foreground">Direct</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Succès</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité de la session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Connexion réussie</p>
                  <p className="text-xs text-muted-foreground">14:32:18 • Authentification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Accès au dashboard</p>
                  <p className="text-xs text-muted-foreground">14:32:25 • Navigation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Scan émotionnel effectué</p>
                  <p className="text-xs text-muted-foreground">14:45:12 • Action utilisateur</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Accès aux rapports</p>
                  <p className="text-xs text-muted-foreground">15:23:45 • Navigation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Téléchargement rapport</p>
                  <p className="text-xs text-muted-foreground">15:28:33 • Téléchargement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Session en cours</p>
                  <p className="text-xs text-muted-foreground">Dernière activité: 17:06:52</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyse de sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Évaluation des risques</label>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Faible risque</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Connexion depuis une localisation habituelle avec un appareil reconnu
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Authentification</label>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">2FA activé</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Authentification à deux facteurs validée avec succès
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comportement</label>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Normal</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Modèle d'utilisation conforme aux habitudes utilisateur
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminAccessLogDetail;