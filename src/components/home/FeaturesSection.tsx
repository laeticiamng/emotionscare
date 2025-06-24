
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Shield, Users, Zap, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Bien-être émotionnel',
    description: 'Analysez et améliorez votre santé mentale avec des outils IA avancés'
  },
  {
    icon: Brain,
    title: 'Intelligence artificielle',
    description: 'Coach IA personnalisé disponible 24/7 pour vous accompagner'
  },
  {
    icon: Shield,
    title: 'Sécurité RGPD',
    description: 'Vos données sont protégées selon les standards les plus stricts'
  },
  {
    icon: Users,
    title: 'Espaces dédiés',
    description: 'Interfaces spécialisées pour particuliers et entreprises'
  },
  {
    icon: Zap,
    title: 'Résultats rapides',
    description: 'Constatez des améliorations dès les premières sessions'
  },
  {
    icon: TrendingUp,
    title: 'Suivi personnalisé',
    description: 'Tableaux de bord détaillés pour mesurer vos progrès'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Pourquoi choisir EmotionsCare ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète conçue par des experts pour transformer votre bien-être émotionnel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
