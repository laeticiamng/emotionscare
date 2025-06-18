import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Bot, Clock } from 'lucide-react';

const B2BAdminCoachManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Coach IA</h1>
        <p className="text-muted-foreground">
          Configuration et suivi des interactions avec le coach IA
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations aujourd'hui</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+18% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Sur 120 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Très rapide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration du coach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Style de communication</label>
              <div className="flex space-x-2">
                <Button variant="default" size="sm">Empathique</Button>
                <Button variant="outline" size="sm">Professionnel</Button>
                <Button variant="outline" size="sm">Motivant</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fonctionnalités actives</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="recommendations" defaultChecked />
                  <label htmlFor="recommendations" className="text-sm">Recommandations personnalisées</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="crisis" defaultChecked />
                  <label htmlFor="crisis" className="text-sm">Détection de crise</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="proactive" />
                  <label htmlFor="proactive" className="text-sm">Messages proactifs</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sujets les plus abordés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Gestion du stress</span>
                  <span className="text-sm font-medium">38%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-red-500 h-2 rounded" style={{ width: '38%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Équilibre vie pro/perso</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-yellow-500 h-2 rounded" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Motivation</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: '22%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Relations d'équipe</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminCoachManagement;