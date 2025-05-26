
import * as React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Building, Sparkles, Shield, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header avec navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                Production Ready
              </Badge>
              <Button 
                onClick={() => navigate('/choose-mode')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Votre plateforme de{' '}
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              bien-être émotionnel
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Une solution complète pour accompagner votre épanouissement personnel et professionnel 
            grâce à l'intelligence artificielle et aux dernières innovations en neurosciences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-3"
            >
              <Heart className="mr-2 h-5 w-5" />
              Découvrir la plateforme
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/b2b/selection')}
              className="text-lg px-8 py-3 border-2"
            >
              <Building className="mr-2 h-5 w-5" />
              Solutions Entreprise
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une approche innovante du bien-être
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Combinant technologie de pointe et approche humaine pour un accompagnement personnalisé
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: 'Suivi Émotionnel',
              description: 'Analysez et comprenez vos émotions avec des outils scientifiques avancés',
              color: 'from-pink-500 to-rose-500'
            },
            {
              icon: Users,
              title: 'Accompagnement Collectif',
              description: 'Créez du lien et partagez votre parcours avec une communauté bienveillante',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Zap,
              title: 'IA Personnalisée',
              description: 'Bénéficiez de recommandations adaptées grâce à notre coach intelligent',
              color: 'from-purple-500 to-indigo-500'
            },
            {
              icon: Shield,
              title: 'Sécurité Garantie',
              description: 'Vos données sont protégées selon les plus hauts standards de sécurité',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: Sparkles,
              title: 'Expérience Immersive',
              description: 'Plongez dans des environnements VR apaisants et thérapeutiques',
              color: 'from-orange-500 to-red-500'
            },
            {
              icon: Building,
              title: 'Solutions B2B',
              description: 'Transformez le bien-être au travail avec nos outils professionnels',
              color: 'from-teal-500 to-cyan-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont déjà commencé leur parcours
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Commencer gratuitement
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="text-xl font-bold">EmotionsCare</span>
          </div>
          <p className="text-gray-400">
            © 2024 EmotionsCare. Votre bien-être, notre priorité.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
