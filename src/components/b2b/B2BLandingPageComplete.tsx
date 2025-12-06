import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Brain,
  Heart,
  Target,
  Star,
  ArrowRight
} from 'lucide-react';

const B2BLandingPageComplete: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestion d'équipe",
      description: "Tableaux de bord RH avec données anonymisées",
      badge: "Manager"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Conformité RGPD",
      description: "Protection totale des données personnelles",
      badge: "Sécurisé"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics avancés",
      description: "Heatmaps et rapports de bien-être équipe",
      badge: "Insights"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "IA personnalisée",
      description: "Coach IA adapté au contexte professionnel",
      badge: "IA"
    }
  ];

  const modules = [
    { name: "Flash Glow", description: "Boost d'énergie 2min", icon: <Zap className="h-5 w-5" /> },
    { name: "Musicothérapie", description: "Harmonisation émotionnelle", icon: <Heart className="h-5 w-5" /> },
    { name: "Journal IA", description: "Analyse sentiment vocal", icon: <Brain className="h-5 w-5" /> },
    { name: "Cohérence cardiaque", description: "Respiration guidée", icon: <Target className="h-5 w-5" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Available */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Modules disponibles pour vos équipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {modules.map((module, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-primary">
                  {module.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{module.name}</div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI Preview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="font-semibold">Engagement +40%</div>
              <div className="text-sm text-muted-foreground">Amélioration mesurée</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="font-semibold">Anonymat 100%</div>
              <div className="text-sm text-muted-foreground">Données protégées</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="font-semibold">Bien-être +60%</div>
              <div className="text-sm text-muted-foreground">Satisfaction équipe</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Prêt à transformer votre organisation ?</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/signup?segment=b2b">
              Demander une démo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/entreprise">
              Accès équipe existante
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BLandingPageComplete;