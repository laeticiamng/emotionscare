import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Heart, Zap } from 'lucide-react';
import { ScreenSilkButton } from '@/components/screenSilk/ScreenSilkButton';

const ScreenSilkPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Screen-Silk Break
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Micro-pauses relaxantes avec suivi HRV optionnel. 
          Prenez 1 à 3 minutes pour recentrer votre énergie avec une guidance respiratoire douce.
        </p>
      </div>

      {/* Main Action */}
      <div className="text-center mb-12">
        <ScreenSilkButton size="lg" className="text-lg px-8 py-6 h-auto" />
        <p className="text-sm text-muted-foreground mt-4">
          Overlay apaisant • Guidance respiratoire • Suivi HRV discret
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Micro-durées</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Sessions courtes de 60 à 180 secondes, parfaites pour s'intégrer dans votre flux de travail.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">1 min</Badge>
              <Badge variant="outline" className="text-xs">1.5 min</Badge>
              <Badge variant="outline" className="text-xs">2 min</Badge>
              <Badge variant="outline" className="text-xs">3 min</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Patterns respiratoires</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Techniques de respiration validées pour réduire le stress et améliorer la concentration.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">4-2-4</Badge>
              <Badge variant="outline" className="text-xs">4-6-8</Badge>
              <Badge variant="outline" className="text-xs">5-5</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Suivi HRV optionnel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Mesure discrète de la variabilité cardiaque via capteur Bluetooth. Aucun chiffre affiché.
            </p>
            <Badge variant="secondary" className="text-xs">Privacy-first</Badge>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-xl">Comment ça marche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h4 className="font-medium text-sm">Choisir</h4>
              <p className="text-xs text-muted-foreground">
                Pattern respiratoire et durée
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h4 className="font-medium text-sm">Démarrer</h4>
              <p className="text-xs text-muted-foreground">
                Overlay soie d'écran s'active
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h4 className="font-medium text-sm">Respirer</h4>
              <p className="text-xs text-muted-foreground">
                Guidance douce "Inspire / Expire"
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">4</span>
              </div>
              <h4 className="font-medium text-sm">Reset</h4>
              <p className="text-xs text-muted-foreground">
                Badge de confirmation ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Accessibility */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Aucune donnée biométrique affichée ou stockée</p>
            <p>• Respect complet des Privacy Toggles</p>
            <p>• Données HRV traitées en mémoire uniquement</p>
            <p>• Résumés anonymisés pour améliorer l'expérience</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accessibilité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Navigation clavier complète (Espace, Échap)</p>
            <p>• Animations réduites si préféré</p>
            <p>• Annonces vocales des phases</p>
            <p>• Contrastes AA conformes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      <div className="text-center mt-12 p-6 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">Prêt pour votre première pause ?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Commencez par 2 minutes avec le pattern 4-6-8 pour une détente optimale
        </p>
        <ScreenSilkButton />
      </div>
    </div>
  );
};

export default ScreenSilkPage;