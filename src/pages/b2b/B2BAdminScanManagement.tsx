import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Users, Settings, BarChart } from 'lucide-react';

const B2BAdminScanManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Scans Émotionnels</h1>
        <p className="text-muted-foreground">
          Configuration et suivi des scans émotionnels pour votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans aujourd'hui</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">+15% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">Bien-être général</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration des scans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fréquence recommandée</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Quotidien</Button>
                <Button variant="outline" size="sm">Hebdomadaire</Button>
                <Button variant="default" size="sm">Bi-hebdomadaire</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Types de scan activés</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="voice" defaultChecked />
                  <label htmlFor="voice" className="text-sm">Analyse vocale</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="text" defaultChecked />
                  <label htmlFor="text" className="text-sm">Analyse de texte</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="facial" />
                  <label htmlFor="facial" className="text-sm">Reconnaissance faciale</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Joie</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Stress</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-yellow-500 h-2 rounded" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Fatigue</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-red-500 h-2 rounded" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminScanManagement;