/**
 * 🏢 ENTREPRISE PAGE - EmotionsCare B2B
 * Page d'accueil pour les solutions entreprise
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const EntreprisePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Bien-être d'équipe",
      description: "Analysez et améliorez la santé émotionnelle de vos collaborateurs"
    },
    {
      icon: BarChart3,
      title: "Analytics RH",
      description: "Tableaux de bord complets pour le suivi du bien-être au travail"
    },
    {
      icon: Shield,
      title: "Conformité RGPD",
      description: "Protection totale des données sensibles de vos employés"
    },
    {
      icon: TrendingUp,
      title: "ROI Mesurable",
      description: "Impact quantifiable sur la productivité et la rétention"
    }
  ];

  const benefits = [
    "Réduction de 30% de l'absentéisme",
    "Amélioration de 25% de la productivité",
    "Augmentation de 40% de la satisfaction employé",
    "Diminution de 50% du turnover",
    "Support 24/7 pour vos équipes",
    "Intégration avec vos outils RH existants"
  ];

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Solution B2B Premium
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              EmotionsCare Business
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transformez le bien-être de vos collaborateurs avec notre plateforme 
            d'intelligence émotionnelle dédiée aux entreprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Demander une démo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/help')}>
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Résultats Prouvés
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nos clients entreprise constatent des améliorations significatives 
              dans tous les indicateurs clés de performance RH.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
              </div>
              <blockquote className="text-lg italic mb-4">
                "EmotionsCare a révolutionné notre approche du bien-être au travail. 
                Nos équipes sont plus épanouies et plus productives."
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                - Marie Dubois, DRH chez TechCorp (500+ employés)
              </cite>
            </Card>

            <Card className="p-6 bg-primary/5">
              <h3 className="font-semibold mb-2">Tarification Enterprise</h3>
              <p className="text-muted-foreground mb-4">
                Solutions sur mesure adaptées à la taille de votre organisation
              </p>
              <div className="text-2xl font-bold text-primary mb-4">
                Sur devis
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Nombre d'utilisateurs illimité</li>
                <li>• Support prioritaire 24/7</li>
                <li>• Intégrations personnalisées</li>
                <li>• Formation de vos équipes</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center p-8 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent>
            <h3 className="text-2xl font-bold mb-4">
              Prêt à transformer votre entreprise ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Rejoignez les centaines d'entreprises qui font confiance à EmotionsCare 
              pour le bien-être de leurs collaborateurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                <Building className="h-5 w-5 mr-2" />
                Planifier une démo
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/help')}>
                Télécharger la brochure
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Démo gratuite • Sans engagement • Réponse sous 24h
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EntreprisePage;