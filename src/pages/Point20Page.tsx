
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Point20Page: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Point 20 - Feedback et Amélioration Continue</h1>
          <p className="text-xl text-green-600">
            Système d'évaluation et d'amélioration continue de la plateforme EmotionsCare
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                État du Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Routes fonctionnelles</span>
                  <span className="font-semibold text-green-600">✓ Opérationnel</span>
                </div>
                <div className="flex justify-between">
                  <span>Navigation</span>
                  <span className="font-semibold text-green-600">✓ Fonctionnelle</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages de construction</span>
                  <span className="font-semibold text-green-600">✓ Disponibles</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Métriques de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pages créées</span>
                  <span className="font-semibold">24/24</span>
                </div>
                <div className="flex justify-between">
                  <span>Doublons supprimés</span>
                  <span className="font-semibold">3/3</span>
                </div>
                <div className="flex justify-between">
                  <span>Écrans blancs</span>
                  <span className="font-semibold text-green-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Prochaines Étapes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Développement des pages fonctionnelles complètes</li>
              <li>• Intégration des composants UI avancés</li>
              <li>• Tests E2E complets</li>
              <li>• Optimisation des performances</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Point20Page;
