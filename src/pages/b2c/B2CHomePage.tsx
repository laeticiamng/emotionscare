
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle, 
  Headphones,
  Trophy,
  Users,
  Star,
  ArrowRight
} from 'lucide-react';

const B2CHomePage: React.FC = () => {
  const navigate = useNavigate();

  const personalFeatures = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Scanner Émotionnel Personnel",
      description: "Analysez vos émotions en temps réel",
      path: "/scan",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Musicothérapie Personnalisée",
      description: "Playlists adaptées à votre humeur",
      path: "/music",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Journal Privé",
      description: "Suivez votre évolution personnelle",
      path: "/journal",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Coach Personnel IA",
      description: "Accompagnement individualisé",
      path: "/coach",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Expériences VR",
      description: "Sessions immersives personnelles",
      path: "/vr",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Méditation Guidée",
      description: "Programmes adaptés à vos besoins",
      path: "/meditation",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900" data-testid="page-root">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Espace Particulier
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Espace Particulier
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
            Votre espace personnel de bien-être émotionnel. Accédez à tous nos outils conçus pour votre développement personnel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/b2c/login')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Se connecter
            </Button>
            <Button 
              onClick={() => navigate('/b2c/register')}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              S'inscrire
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <span>Découvrir</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Commencez votre parcours</h2>
              <p className="text-lg opacity-90 mb-6">
                Rejoignez notre communauté et découvrez le pouvoir de la technologie au service de votre bien-être
              </p>
              <Button 
                onClick={() => navigate('/b2c/register')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Users className="mr-2 h-5 w-5" />
                Créer mon compte
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CHomePage;
