
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones as Vr, Play, Pause, Settings } from 'lucide-react';

const B2BAdminVRManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion VR Thérapie</h1>
          <p className="text-muted-foreground">
            Gérez les sessions et contenus de réalité virtuelle
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configurer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Actives</CardTitle>
            <Vr className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Complétées</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              +23% ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15min</div>
            <p className="text-xs text-muted-foreground">
              +2min ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenus VR Populaires</CardTitle>
            <CardDescription>
              Les expériences VR les plus utilisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Méditation Plage</p>
                  <p className="text-sm text-muted-foreground">Relaxation guidée</p>
                </div>
                <span className="text-sm font-medium">342 sessions</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Forêt Zen</p>
                  <p className="text-sm text-muted-foreground">Immersion nature</p>
                </div>
                <span className="text-sm font-medium">268 sessions</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Respiration Guidée</p>
                  <p className="text-sm text-muted-foreground">Exercices de respiration</p>
                </div>
                <span className="text-sm font-medium">187 sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Matériel</CardTitle>
            <CardDescription>
              Statut des équipements VR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Casques VR disponibles</span>
                <span className="text-sm font-medium">8/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stations VR actives</span>
                <span className="text-sm font-medium">6/8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dernière maintenance</span>
                <span className="text-sm font-medium">Il y a 3 jours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminVRManagement;
