import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  BarChart3, 
  Shield, 
  Heart, 
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BEntreprisePage = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestion d\'équipes',
      description: 'Suivez le bien-être de vos collaborateurs en temps réel',
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics avancées',
      description: 'Tableaux de bord et rapports détaillés sur la santé mentale',
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'Sécurité & Conformité',
      description: 'Données sécurisées, conforme RGPD et ISO 27001',
      color: 'bg-purple-500'
    },
    {
      icon: Heart,
      title: 'Programmes bien-être',
      description: 'Modules personnalisés pour améliorer la QVT',
      color: 'bg-red-500'
    }
  ];

  const benefits = [
    'Réduction de l\'absentéisme jusqu\'à 40%',
    'Amélioration de la productivité de 25%',
    'Meilleure rétention des talents',
    'Conformité aux obligations d\'entreprise'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" data-testid="page-root">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <Badge variant="secondary" className="mb-4">
            Solution B2B
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Le bien-être de vos équipes,
            <br />notre priorité
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plateforme complète de bien-être mental pour entreprises. 
            Analysez, prévenez et améliorez la santé mentale de vos collaborateurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/b2b/selection">
              <Button size="lg" className="text-lg px-8">
                Demander une démo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Parler à un expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Une solution complète pour votre entreprise
            </h2>
            <p className="text-lg text-muted-foreground">
              Tous les outils nécessaires pour prendre soin du bien-être de vos équipes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Des résultats mesurables pour votre organisation
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-500 text-white p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-muted-foreground">Réduction absentéisme</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">25%</div>
                    <div className="text-sm text-muted-foreground">Amélioration productivité</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default B2BEntreprisePage;