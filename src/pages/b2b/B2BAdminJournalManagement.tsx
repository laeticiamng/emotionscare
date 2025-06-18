import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, TrendingUp, FileText } from 'lucide-react';

const B2BAdminJournalManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion du Journal</h1>
        <p className="text-muted-foreground">
          Suivi et configuration des journaux émotionnels de votre organisation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrées aujourd'hui</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+8% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">Taux de rétention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots-clés tendance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration du journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rappels automatiques</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Matin</Button>
                <Button variant="default" size="sm">Midi</Button>
                <Button variant="outline" size="sm">Soir</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Analyse de sentiment</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sentiment" defaultChecked />
                  <label htmlFor="sentiment" className="text-sm">Activer l'analyse IA</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="keywords" defaultChecked />
                  <label htmlFor="keywords" className="text-sm">Extraction de mots-clés</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="trends" />
                  <label htmlFor="trends" className="text-sm">Détection de tendances</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mots-clés fréquents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">stress</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">équipe</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">projet</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">motivation</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">fatigue</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">réussite</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Basé sur les 100 dernières entrées
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminJournalManagement;