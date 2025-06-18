
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

const B2BAdminEmotionAnalytics: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Émotionnelles</h1>
        <p className="text-muted-foreground">
          Analysez le bien-être émotionnel de votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2/10</div>
            <p className="text-xs text-muted-foreground">
              +0.3 ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Niveau</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.1/10</div>
            <p className="text-xs text-muted-foreground">
              -0.5 ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">
              +7% ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition Émotionnelle</CardTitle>
            <CardDescription>
              Distribution des émotions cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Joie</span>
                </div>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Calme</span>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm">Neutre</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm">Stress</span>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm">Tristesse</span>
                </div>
                <span className="text-sm font-medium">4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances par Département</CardTitle>
            <CardDescription>
              Évolution du bien-être par équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">IT & Développement</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-green-200 rounded-full mr-2">
                    <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">8.1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Marketing</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-green-200 rounded-full mr-2">
                    <div className="w-10 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">7.5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">RH</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-yellow-200 rounded-full mr-2">
                    <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">6.8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Ventes</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-orange-200 rounded-full mr-2">
                    <div className="w-6 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">6.2</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminEmotionAnalytics;
