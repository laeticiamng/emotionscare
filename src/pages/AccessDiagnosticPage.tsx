
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Ear, Mouse, Keyboard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AccessDiagnosticPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Diagnostic d'accessibilité</h1>
        <p className="text-lg text-muted-foreground">
          Personnalisons votre expérience pour une accessibilité optimale
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évaluation de vos besoins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Vision
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <span>J'utilise un lecteur d'écran</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'ai besoin d'un contraste élevé</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'ai besoin d'une police plus grande</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Je suis daltonien</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Ear className="w-5 h-5" />
              Audition
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <span>J'ai besoin de sous-titres</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'utilise des signaux visuels</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Je préfère les descriptions audio</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mouse className="w-5 h-5" />
              Motricité
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <span>J'utilise principalement le clavier</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'ai besoin de zones de clic plus grandes</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'ai des difficultés avec les gestes précis</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Cognition
            </h3>
            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between">
                <span>Je préfère une interface simplifiée</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>J'ai besoin de plus de temps pour lire</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Les animations me distraient</span>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Appareil principal
            </h3>
            <div className="space-y-3 ml-7">
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Ordinateur de bureau</option>
                <option>Ordinateur portable</option>
                <option>Tablette</option>
                <option>Smartphone</option>
                <option>Technologie d'assistance</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test de contraste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gray-100 border rounded">
              <p className="text-gray-800">Contraste normal</p>
              <p className="text-sm text-gray-600">Ratio: 4.5:1</p>
            </div>
            <div className="p-4 bg-black border rounded">
              <p className="text-white">Contraste élevé</p>
              <p className="text-sm text-gray-300">Ratio: 21:1</p>
            </div>
            <div className="p-4 bg-blue-900 border rounded">
              <p className="text-yellow-200">Contraste adapté</p>
              <p className="text-sm text-blue-200">Ratio: 7:1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" className="px-8">
          Appliquer mes préférences d'accessibilité
        </Button>
      </div>
    </div>
  );
};

export default AccessDiagnosticPage;
