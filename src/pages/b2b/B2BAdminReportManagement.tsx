import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart, Calendar } from 'lucide-react';

const B2BAdminReportManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Rapports</h1>
        <p className="text-muted-foreground">
          Génération et configuration des rapports de bien-être
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports générés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports automatiques</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Programmés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses disponibles</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Types d'analyses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Types de rapports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Rapport mensuel bien-être</p>
                  <p className="text-xs text-muted-foreground">Vue d'ensemble organisation</p>
                </div>
                <Button variant="outline" size="sm">Générer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Analyse département</p>
                  <p className="text-xs text-muted-foreground">Comparaison équipes</p>
                </div>
                <Button variant="outline" size="sm">Générer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Tendances émotionnelles</p>
                  <p className="text-xs text-muted-foreground">Évolution sur 3 mois</p>
                </div>
                <Button variant="outline" size="sm">Générer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">ROI bien-être</p>
                  <p className="text-xs text-muted-foreground">Impact financier</p>
                </div>
                <Button variant="outline" size="sm">Générer</Button>
              </div>
            </div>
            <Button className="w-full">Rapport personnalisé</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rapports automatiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Bilan hebdomadaire</p>
                  <p className="text-xs text-muted-foreground">Chaque lundi à 9h00</p>
                  <p className="text-xs text-muted-foreground">Direction + RH</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Rapport mensuel complet</p>
                  <p className="text-xs text-muted-foreground">1er de chaque mois</p>
                  <p className="text-xs text-muted-foreground">Comité de direction</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Alertes temps réel</p>
                  <p className="text-xs text-muted-foreground">Déclenchement automatique</p>
                  <p className="text-xs text-muted-foreground">Gestionnaires d'équipe</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format d'export</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">PDF</Button>
                <Button variant="default" size="sm">Excel</Button>
                <Button variant="outline" size="sm">PowerPoint</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminReportManagement;