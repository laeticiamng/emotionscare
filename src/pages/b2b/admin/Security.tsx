import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShieldCheck, ListChecks } from 'lucide-react';

interface Incident {
  id: string;
  message: string;
  date: string;
}

const sampleIncidents: Incident[] = [
  { id: '1', message: 'Tentative de connexion suspecte', date: '2025-05-01' },
  { id: '2', message: 'Modification de permissions', date: '2025-04-20' },
];

const SecurityDashboard: React.FC = () => {
  const [incidents] = useState(sampleIncidents);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Sécurité</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Statut Général
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucune activité anormale détectée sur les 24 dernières heures.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" /> Historique des incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {incidents.map((incident) => (
                  <li key={incident.id} className="flex items-center justify-between">
                    <span>{incident.message}</span>
                    <span className="text-muted-foreground text-xs">{incident.date}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
