
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FeedbackPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Feedback et amélioration continue</h1>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Nouveau sondage
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback reçus</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction moyenne</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">+0.3 vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points d'amélioration</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">En cours de traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Améliorations déployées</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feedback récents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Interface plus intuitive</span>
                <Badge variant="secondary">Suggestion</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                "L'interface pourrait être plus intuitive pour les nouveaux utilisateurs"
              </p>
            </div>

            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Notifications trop fréquentes</span>
                <Badge variant="destructive">Problème</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                "Je reçois trop de notifications push, c'est distrayant"
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Excellent module VR</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Positif</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                "Le module VR de méditation est fantastique !"
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse des sentiments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Positif</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm">72%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Neutre</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <span className="text-sm">18%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Négatif</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap des améliorations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Planification et suivi des améliorations produit en cours de développement
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
