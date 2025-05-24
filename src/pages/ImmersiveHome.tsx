
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Music, Calendar, Star, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials] = useState([
    {
      id: 1,
      name: "Marie L.",
      text: "EmotionsCare m'a aidée à mieux comprendre mes émotions au quotidien.",
      rating: 5
    },
    {
      id: 2,
      name: "Pierre D.",
      text: "L'IA coach est vraiment impressionnante, j'ai l'impression d'avoir un thérapeute personnel.",
      rating: 5
    },
    {
      id: 3,
      name: "Sophie M.",
      text: "La musique générée correspond parfaitement à mon état d'esprit.",
      rating: 4
    }
  ]);

  const [features] = useState([
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Analyse émotionnelle IA",
      description: "Scannez vos émotions via voix, texte ou image grâce à l'intelligence artificielle Hume.",
      action: () => navigate('/scan')
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Coach personnel IA",
      description: "Bénéficiez de conseils personnalisés 24h/24 avec notre coach intelligent.",
      action: () => navigate('/coach')
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musique thérapeutique",
      description: "Générez de la musique adaptée à vos émotions pour améliorer votre bien-être.",
      action: () => navigate('/music')
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: "Journal personnel",
      description: "Notez vos pensées et suivez votre progression émotionnelle.",
      action: () => navigate('/journal')
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.h1 
            className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Prenez soin de votre{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              bien-être émotionnel
            </span>
          </motion.h1>
          
          <motion.p 
            className="mb-8 text-xl text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Analysez vos émotions, bénéficiez de conseils personnalisés et générez de la musique 
            thérapeutique grâce à l'intelligence artificielle.
          </motion.p>
          
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/b2c/register')}
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/scan')}
            >
              <Play className="mr-2 h-5 w-5" />
              Essayer maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Des outils puissants pour votre bien-être
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos fonctionnalités basées sur l'intelligence artificielle
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                  onClick={feature.action}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Pourquoi choisir EmotionsCare ?
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 text-4xl">🧠</div>
              <h3 className="mb-2 text-xl font-semibold">IA Avancée</h3>
              <p className="text-gray-600">
                Utilise les dernières technologies d'IA pour une analyse précise de vos émotions
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 text-4xl">🔒</div>
              <h3 className="mb-2 text-xl font-semibold">Confidentialité</h3>
              <p className="text-gray-600">
                Vos données sont chiffrées et protégées selon les standards les plus élevés
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 text-4xl">📱</div>
              <h3 className="mb-2 text-xl font-semibold">Accessible 24/7</h3>
              <p className="text-gray-600">
                Accédez à votre coach personnel depuis n'importe où, à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Ce que disent nos utilisateurs
          </h2>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic text-gray-600">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="mb-6 text-4xl font-bold">
            Commencez votre parcours de bien-être aujourd'hui
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/b2c/register')}
            >
              Inscription gratuite
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/b2b/selection')}
            >
              Solutions entreprise
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImmersiveHome;
