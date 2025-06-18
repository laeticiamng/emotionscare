import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const B2BAdminOrchestrationManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion d'Orchestration</h1>
        <p className="text-muted-foreground">
          Automatisation et orchestration des processus de bien-être
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows actifs</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Automatisations en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exécutions aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+15% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Succès</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Taux de réussite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Erreurs à traiter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workflows disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Détection stress élevé</p>
                  <p className="text-xs text-muted-foreground">Scan → Analyse → Notification RH</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Rappel bien-être quotidien</p>
                  <p className="text-xs text-muted-foreground">Horaire → Notification → Suivi</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Onboarding nouveau employé</p>
                  <p className="text-xs text-muted-foreground">Inscription → Formation → Suivi</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Rapport hebdomadaire auto</p>
                  <p className="text-xs text-muted-foreground">Collecte → Analyse → Envoi</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
            </div>
            <Button className="w-full">Créer nouveau workflow</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique d'exécution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Rapport hebdomadaire généré</p>
                  <p className="text-xs text-muted-foreground">Workflow: Rapport auto • Il y a 2h</p>
                  <p className="text-xs text-green-600">Succès • 120 destinataires</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Notification stress envoyée</p>
                  <p className="text-xs text-muted-foreground">Workflow: Détection stress • Il y a 4h</p>
                  <p className="text-xs text-green-600">Succès • RH notifié</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Échec envoi rappel</p>
                  <p className="text-xs text-muted-foreground">Workflow: Rappel quotidien • Il y a 6h</p>
                  <p className="text-xs text-red-600">Erreur • Service email indisponible</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Onboarding démarré</p>
                  <p className="text-xs text-muted-foreground">Workflow: Nouveau employé • Hier</p>
                  <p className="text-xs text-blue-600">En cours • Étape 2/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminOrchestrationManagement;