
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Point20Page: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Point 20 - Excellence</h1>
        <p className="text-lg text-muted-foreground">
          L'évaluation et l'amélioration continue au cœur de notre mission
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score d'excellence</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.7/10</div>
            <p className="text-xs text-muted-foreground">Qualité globale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amélioration continue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">Taux de satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Normes respectées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Qualité du service</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Innovation</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Sécurité</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Accessibilité</span>
                <span className="text-sm font-medium">97%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions d'amélioration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Optimisation UX</h4>
              <p className="text-sm text-muted-foreground">
                Amélioration continue de l'expérience utilisateur basée sur les retours
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Innovation technologique</h4>
              <p className="text-sm text-muted-foreground">
                Intégration des dernières avancées en IA et bien-être digital
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">Formation continue</h4>
              <p className="text-sm text-muted-foreground">
                Formation régulière des équipes aux meilleures pratiques
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement qualité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-lg">
              Notre engagement : une plateforme de bien-être digital d'excellence, 
              en amélioration continue, centrée sur vos besoins.
            </p>
            <Button size="lg">
              Découvrir notre démarche qualité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Point20Page;
