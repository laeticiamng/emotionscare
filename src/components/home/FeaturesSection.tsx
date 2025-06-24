
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, Shield, BarChart3, Headphones } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "IA Coach Personnel",
      description: "Assistant virtuel intelligent qui s'adapte à vos besoins émotionnels et vous guide au quotidien."
    },
    {
      icon: Heart,
      title: "Scan Émotionnel",
      description: "Analysez votre état émotionnel en temps réel grâce à notre technologie d'IA avancée."
    },
    {
      icon: Users,
      title: "Communauté Bienveillante",
      description: "Connectez-vous avec d'autres professionnels dans un environnement sécurisé et confidentiel."
    },
    {
      icon: Shield,
      title: "Sécurité & Confidentialité",
      description: "Vos données sont protégées avec les plus hauts standards de sécurité et de confidentialité."
    },
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Suivez votre progression avec des tableaux de bord détaillés et des insights personnalisés."
    },
    {
      icon: Headphones,
      title: "Thérapie Musicale",
      description: "Découvrez des playlists personnalisées et des sessions audio thérapeutiques."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Une plateforme complète pour votre bien-être
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos fonctionnalités innovantes conçues spécifiquement pour les professionnels de santé
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center">
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
