import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Users, Timer, Heart } from 'lucide-react';

const B2BAdminBreathManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Exercices de Respiration</h1>
        <p className="text-muted-foreground">
          Configuration et suivi des sessions de respiration guidée
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions aujourd'hui</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">+25% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8min</div>
            <p className="text-xs text-muted-foreground">Par session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amélioration HRV</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">Moyenne organisation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Programmes de respiration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Respiration 4-7-8</p>
                  <p className="text-xs text-muted-foreground">Relaxation • 5min</p>
                </div>
                <Button variant="outline" size="sm">Démarrer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Cohérence cardiaque</p>
                  <p className="text-xs text-muted-foreground">Anti-stress • 3min</p>
                </div>
                <Button variant="outline" size="sm">Démarrer</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Respiration énergisante</p>
                  <p className="text-xs text-muted-foreground">Vitalité • 7min</p>
                </div>
                <Button variant="outline" size="sm">Démarrer</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouveau programme</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métriques de bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Réduction du stress</span>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Amélioration du sommeil</span>
                  <span className="text-sm font-medium">67%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '67%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Concentration</span>
                  <span className="text-sm font-medium">74%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-purple-500 h-2 rounded" style={{ width: '74%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminBreathManagement;