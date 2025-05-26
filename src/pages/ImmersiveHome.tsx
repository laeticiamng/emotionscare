
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, ArrowRight, Play } from 'lucide-react';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Analyse émotionnelle IA',
      description: 'Comprenez vos émotions grâce à notre technologie avancée',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Heart,
      title: 'Musique thérapeutique',
      description: 'Playlists personnalisées adaptées à votre état émotionnel',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Users,
      title: 'Accompagnement coach',
      description: 'Support personnalisé avec notre IA bienveillante',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 font-light">
              Votre plateforme de bien-être émotionnel
              <span className="block text-lg mt-2 opacity-75">powered by AI</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/choose-mode')}
              >
                <Play className="mr-2 h-5 w-5" />
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 px-8 py-4 text-lg"
                onClick={() => navigate('/b2b/selection')}
              >
                Espace Entreprise
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Découvrez nos fonctionnalités
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Une approche complète du bien-être émotionnel, alimentée par l'intelligence artificielle
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="relative overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <CardHeader className="text-center space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à prendre soin de votre bien-être émotionnel ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui font confiance à EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4"
                onClick={() => navigate('/choose-mode')}
              >
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => navigate('/b2b/selection')}
              >
                Solutions Entreprise
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImmersiveHome;
