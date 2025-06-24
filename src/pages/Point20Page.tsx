
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

const Point20Page: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">Point 20</Badge>
          <h1 className="text-4xl font-bold mb-4">Fonctionnalités Avancées</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez les capacités étendues d'EmotionsCare
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "IA Coach Avancé", description: "Assistant personnel intelligent" },
            { title: "Analyses Prédictives", description: "Anticipation des besoins émotionnels" },
            { title: "Reporting Avancé", description: "Tableaux de bord détaillés" },
            { title: "Intégrations", description: "Connexions avec vos outils" },
            { title: "Support Premium", description: "Assistance prioritaire 24/7" },
            { title: "Conformité RGPD", description: "Protection maximale des données" }
          ].map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Point20Page;
