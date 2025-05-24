
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Music, Headphones, MessageSquare, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CURRENT_ROUTES } from '@/utils/routeUtils';
import { DEFAULT_GREETINGS, TimeOfDay } from '@/constants/defaults';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      let timeOfDay: TimeOfDay;
      
      if (hour < 12) timeOfDay = TimeOfDay.MORNING;
      else if (hour < 17) timeOfDay = TimeOfDay.AFTERNOON;
      else if (hour < 22) timeOfDay = TimeOfDay.EVENING;
      else timeOfDay = TimeOfDay.NIGHT;
      
      setGreeting(DEFAULT_GREETINGS[timeOfDay]);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Scanner d'émotions IA",
      description: "Analysez vos émotions en temps réel avec notre technologie avancée",
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      title: "Coach émotionnel",
      description: "Bénéficiez d'un accompagnement personnalisé 24h/24",
      color: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musique thérapeutique",
      description: "Découvrez des compositions adaptées à votre humeur",
      color: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: <Headphones className="h-8 w-8 text-orange-500" />,
      title: "Expériences VR",
      description: "Immergez-vous dans des environnements relaxants",
      color: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const stats = [
    { value: "50K+", label: "Utilisateurs actifs" },
    { value: "95%", label: "Satisfaction" },
    { value: "24/7", label: "Disponibilité" },
    { value: "12", label: "Langues supportées" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-7xl text-center"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Powered by AI
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </h1>
          
          <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
            {greeting}
          </p>
          
          <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">
            Votre plateforme de bien-être émotionnel alimentée par l'intelligence artificielle. 
            Découvrez un nouveau niveau de compréhension de vos émotions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => navigate(CURRENT_ROUTES.B2C_LOGIN)}
              size="lg"
              className="group bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-lg font-semibold text-white hover:from-pink-600 hover:to-rose-600"
            >
              <Heart className="mr-2 h-5 w-5" />
              Espace Personnel
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              onClick={() => navigate(CURRENT_ROUTES.B2B_SELECTION)}
              variant="outline"
              size="lg"
              className="group border-2 px-8 py-4 text-lg font-semibold"
            >
              <Brain className="mr-2 h-5 w-5" />
              Espace Entreprise
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Une approche révolutionnaire du bien-être
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Découvrez nos outils innovants conçus pour vous accompagner dans votre parcours émotionnel
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Prêt à transformer votre bien-être émotionnel ?
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Rejoignez des milliers d'utilisateurs qui ont déjà découvert une nouvelle façon de comprendre et gérer leurs émotions.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => navigate('/philosophy')}
                variant="outline"
                size="lg"
                className="group"
              >
                <Star className="mr-2 h-5 w-5" />
                Découvrir notre philosophie
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ImmersiveHome;
