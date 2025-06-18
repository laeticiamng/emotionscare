import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart, Filter, Target } from 'lucide-react';

const B2BAdminSegmentManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Segmentation</h1>
        <p className="text-muted-foreground">
          Segmentation et analyse des groupes d'utilisateurs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segments actifs</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Groupes configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs segmentés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">115</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses effectuées</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ciblage actif</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Campagnes ciblées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Segments existants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Équipe Management</p>
                  <p className="text-xs text-muted-foreground">12 membres • Stress élevé</p>
                </div>
                <Button variant="outline" size="sm">Analyser</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Développeurs Junior</p>
                  <p className="text-xs text-muted-foreground">28 membres • Engagement modéré</p>
                </div>
                <Button variant="outline" size="sm">Analyser</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Service Client</p>
                  <p className="text-xs text-muted-foreground">15 membres • Bien-être bon</p>
                </div>
                <Button variant="outline" size="sm">Analyser</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">Nouveaux employés</p>
                  <p className="text-xs text-muted-foreground">8 membres • En adaptation</p>
                </div>
                <Button variant="outline" size="sm">Analyser</Button>
              </div>
            </div>
            <Button className="w-full">Créer nouveau segment</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critères de segmentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Par département</label>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>IT (45%)</span>
                    <span>34 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Marketing (25%)</span>
                    <span>19 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>RH (15%)</span>
                    <span>11 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Ventes (15%)</span>
                    <span>11 personnes</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Par niveau de stress</label>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Faible (40%)</span>
                    <span className="text-green-600">30 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Modéré (45%)</span>
                    <span className="text-yellow-600">34 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Élevé (15%)</span>
                    <span className="text-red-600">11 personnes</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Par engagement</label>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Très actif (30%)</span>
                    <span>23 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Modéré (50%)</span>
                    <span>38 personnes</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Faible (20%)</span>
                    <span>15 personnes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminSegmentManagement;