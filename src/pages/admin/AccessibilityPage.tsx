
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Ear, Mouse, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AccessibilityPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accessibilité</h1>
        <Button>
          <Eye className="w-4 h-4 mr-2" />
          Test d'accessibilité
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score WCAG</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AA</div>
            <p className="text-xs text-muted-foreground">Niveau conforme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contraste</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8:1</div>
            <p className="text-xs text-muted-foreground">Ratio moyen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Navigation clavier</CardTitle>
            <Keyboard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Éléments accessibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecteurs d'écran</CardTitle>
            <Ear className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Compatibilité</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Options d'accessibilité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Mode haut contraste</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Taille de police adaptative</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Réduction des animations</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Focus visuel renforcé</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assistance technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>NVDA</span>
              <span className="text-green-600">✓ Compatible</span>
            </div>
            <div className="flex items-center justify-between">
              <span>JAWS</span>
              <span className="text-green-600">✓ Compatible</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VoiceOver</span>
              <span className="text-green-600">✓ Compatible</span>
            </div>
            <div className="flex items-center justify-between">
              <span>TalkBack</span>
              <span className="text-blue-600">~ Partiel</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapport d'accessibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Rapport détaillé d'accessibilité et recommandations en cours de développement
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPage;
