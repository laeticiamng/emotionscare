import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Point20Page - Protocole de récupération express en 20 minutes
 */
const Point20Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              Point 20
            </h1>
            <p className="text-muted-foreground text-lg">
              Protocole de récupération express en 20 minutes
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Qu'est-ce que le Point 20 ?
            </CardTitle>
            <CardDescription>
              Une méthode scientifique de récupération mentale rapide basée sur la relaxation progressive et la respiration contrôlée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">20</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">4</div>
                <div className="text-sm text-muted-foreground">Étapes</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">90%</div>
                <div className="text-sm text-muted-foreground">Efficacité</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocole */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Étape 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Déconnexion (5 min)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Éliminez toutes les distractions et créez un environnement calme.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Éteignez notifications</li>
                <li>• Trouvez un endroit confortable</li>
                <li>• Fermez les yeux</li>
                <li>• Respirez profondément 3 fois</li>
              </ul>
            </CardContent>
          </Card>

          {/* Étape 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                Relaxation (7 min)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Relaxation progressive des muscles, des pieds à la tête.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Contractez puis relâchez chaque muscle</li>
                <li>• Commencez par les orteils</li>
                <li>• Remontez progressivement</li>
                <li>• Terminez par le visage</li>
              </ul>
            </CardContent>
          </Card>

          {/* Étape 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                Respiration (5 min)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Technique de respiration 4-7-8 pour calmer le système nerveux.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Inspirez par le nez (4 sec)</li>
                <li>• Retenez votre souffle (7 sec)</li>
                <li>• Expirez par la bouche (8 sec)</li>
                <li>• Répétez 4 cycles</li>
              </ul>
            </CardContent>
          </Card>

          {/* Étape 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                Ancrage (3 min)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Revenez progressivement à l'état de vigilance normal.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Bougez doucement les doigts</li>
                <li>• Étirez-vous délicatement</li>
                <li>• Ouvrez les yeux lentement</li>
                <li>• Prenez votre temps</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/app/breath">
            <Button className="w-full sm:w-auto">
              <Target className="h-4 w-4 mr-2" />
              Commencer Point 20
            </Button>
          </Link>
          <Link to="/app/scan">
            <Button variant="outline" className="w-full sm:w-auto">
              Scanner mon état d'abord
            </Button>
          </Link>
        </div>

        {/* Note */}
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Conseil :</strong> Pratiquez le Point 20 régulièrement pour en maximiser l'efficacité. 
              Idéal en milieu de journée ou après un stress intense.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Point20Page;