
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accessibility, Eye, Volume2, Keyboard, MousePointer, CheckCircle } from 'lucide-react';

const AccessibilityPage: React.FC = () => {
  const accessibilityFeatures = [
    { 
      id: 'high_contrast', 
      label: 'Mode Contraste Élevé', 
      description: 'Améliore la lisibilité pour les malvoyants',
      enabled: true,
      usage: 23
    },
    { 
      id: 'large_text', 
      label: 'Texte Agrandi', 
      description: 'Augmente la taille du texte par défaut',
      enabled: true,
      usage: 45
    },
    { 
      id: 'keyboard_navigation', 
      label: 'Navigation Clavier', 
      description: 'Navigation complète au clavier',
      enabled: true,
      usage: 12
    },
    { 
      id: 'screen_reader', 
      label: 'Support Lecteur d\'Écran', 
      description: 'Compatibilité avec les lecteurs d\'écran',
      enabled: true,
      usage: 8
    },
    { 
      id: 'voice_commands', 
      label: 'Commandes Vocales', 
      description: 'Contrôle vocal de l\'interface',
      enabled: false,
      usage: 3
    },
  ];

  const complianceChecks = [
    { standard: 'WCAG 2.1 AA', status: 'passed', score: 95 },
    { standard: 'Section 508', status: 'passed', score: 92 },
    { standard: 'EN 301 549', status: 'warning', score: 88 },
    { standard: 'ADA', status: 'passed', score: 94 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accessibilité</h1>
          <p className="text-muted-foreground">
            Configuration et surveillance de l'accessibilité de la plateforme
          </p>
        </div>
        <Button>
          <Accessibility className="mr-2 h-4 w-4" />
          Test d'Accessibilité
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score WCAG</CardTitle>
            <Accessibility className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95/100</div>
            <p className="text-xs text-muted-foreground">Niveau AA conforme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Assistés</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91</div>
            <p className="text-xs text-muted-foreground">+7 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fonctionnalités Actives</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/5</div>
            <p className="text-xs text-muted-foreground">Options d'accessibilité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Vérification</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2j</div>
            <p className="text-xs text-muted-foreground">Audit automatique</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités d'Accessibilité</CardTitle>
            <CardDescription>Configuration des options d'assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessibilityFeatures.map((feature) => (
              <div key={feature.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{feature.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Switch defaultChecked={feature.enabled} />
                </div>
                <div className="text-xs text-muted-foreground">
                  {feature.usage} utilisateurs actifs
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conformité Standards</CardTitle>
            <CardDescription>Vérification des standards d'accessibilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{check.standard}</h4>
                      <Badge variant={
                        check.status === 'passed' ? 'default' : 
                        check.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {check.status === 'passed' ? 'Conforme' : 
                         check.status === 'warning' ? 'Avertissement' : 'Non conforme'}
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          check.score >= 90 ? 'bg-green-500' : 
                          check.score >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${check.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{check.score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Avancée</CardTitle>
          <CardDescription>Paramètres détaillés d'accessibilité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Options Visuelles</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="font-size">Taille de police par défaut</Label>
                  <Input id="font-size" type="number" defaultValue="16" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="line-height">Hauteur de ligne</Label>
                  <Input id="line-height" type="number" step="0.1" defaultValue="1.5" className="mt-1" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Animation réduite</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <span>Navigation</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Focus visible amélioré</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Raccourcis clavier globaux</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Navigation séquentielle</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium flex items-center space-x-2 mb-4">
              <Volume2 className="h-4 w-4" />
              <span>Options Audio</span>
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <Label>Sons système</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Notifications sonores</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Synthèse vocale</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Sous-titres automatiques</Label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPage;
