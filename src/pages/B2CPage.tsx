
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Zap, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const B2CPage = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Scan Émotionnel",
      description: "Analysez votre état émotionnel en temps réel",
      premium: false
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "VR Thérapie",
      description: "Expériences immersives de relaxation",
      premium: true
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Coach IA Personnel",
      description: "Accompagnement personnalisé 24/7",
      premium: false
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Journal Privé",
      description: "Suivez votre évolution en toute sécurité",
      premium: false
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      rating: 5,
      comment: "EmotionsCare m'a aidée à mieux gérer mon stress quotidien."
    },
    {
      name: "Pierre K.",
      rating: 5,
      comment: "L'interface est intuitive et les exercices vraiment efficaces."
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            Espace Particulier
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez nos outils innovants pour améliorer votre santé mentale et votre qualité de vie au quotidien.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {feature.title}
                    {feature.premium && (
                      <Badge variant="outline" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Pourquoi choisir EmotionsCare ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">100% Confidentiel</h4>
                  <p className="text-sm text-gray-600">Vos données sont protégées par le chiffrement de bout en bout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Scientifiquement Validé</h4>
                  <p className="text-sm text-gray-600">Méthodes basées sur la recherche en psychologie positive</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Support 24/7</h4>
                  <p className="text-sm text-gray-600">Notre équipe est disponible pour vous accompagner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Témoignages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">"{testimonial.comment}"</p>
                  <p className="text-xs text-gray-500">- {testimonial.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <Card className="inline-block p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-2">Prêt à commencer ?</h3>
            <p className="mb-4">Rejoignez des milliers d'utilisateurs qui ont transformé leur bien-être</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/b2c/register">
                  S'inscrire gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Link to="/b2c/login">
                  Se connecter
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CPage;
