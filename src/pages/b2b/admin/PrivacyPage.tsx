
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, FileText, Download, Trash2, Eye, AlertCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const dataRequests = [
    { 
      id: 1, 
      type: 'export', 
      user: 'marie.dupont@example.com',
      status: 'completed',
      requestDate: '2024-01-15',
      completedDate: '2024-01-16'
    },
    { 
      id: 2, 
      type: 'deletion', 
      user: 'jean.martin@example.com',
      status: 'pending',
      requestDate: '2024-01-14',
      completedDate: null
    },
    { 
      id: 3, 
      type: 'rectification', 
      user: 'sophie.chen@example.com',
      status: 'in_progress',
      requestDate: '2024-01-13',
      completedDate: null
    },
  ];

  const consentSettings = [
    { id: 'analytics', label: 'Données d\'analyse', description: 'Collecte des métriques d\'utilisation', enabled: true },
    { id: 'marketing', label: 'Communications marketing', description: 'Envoi d\'emails promotionnels', enabled: false },
    { id: 'personalization', label: 'Personnalisation', description: 'Adaptation de l\'expérience utilisateur', enabled: true },
    { id: 'third_party', label: 'Services tiers', description: 'Partage avec des partenaires sélectionnés', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Confidentialité & RGPD</h1>
          <p className="text-muted-foreground">
            Gestion de la confidentialité et conformité RGPD
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Générer Rapport
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes RGPD</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen de Traitement</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3j</div>
            <p className="text-xs text-muted-foreground">-0.5j vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consentements Actifs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Utilisateurs ayant consenti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations Signalées</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-muted-foreground">Aucune violation détectée</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de Consentement</CardTitle>
            <CardDescription>Configuration des options de consentement par défaut</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {consentSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch defaultChecked={setting.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demandes RGPD Récentes</CardTitle>
            <CardDescription>Dernières demandes de droits des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {request.type === 'export' ? (
                        <Download className="h-4 w-4 text-blue-500" />
                      ) : request.type === 'deletion' ? (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="font-medium text-sm">
                        {request.type === 'export' ? 'Export des données' : 
                         request.type === 'deletion' ? 'Suppression des données' : 
                         'Rectification des données'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.user}</p>
                    <p className="text-xs text-muted-foreground">
                      Demandé le {request.requestDate}
                      {request.completedDate && ` • Complété le ${request.completedDate}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      request.status === 'completed' ? 'default' : 
                      request.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {request.status === 'completed' ? 'Terminé' : 
                       request.status === 'in_progress' ? 'En cours' : 'En attente'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Traiter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rétention des Données</CardTitle>
          <CardDescription>Politiques de conservation des données par type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Données utilisateur</h4>
                <Badge variant="outline">5 ans</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Profils, préférences et historique d'activité
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Logs d'audit</h4>
                <Badge variant="outline">7 ans</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Journaux de sécurité et d'accès système
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Données analytiques</h4>
                <Badge variant="outline">2 ans</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Métriques d'utilisation anonymisées
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;
