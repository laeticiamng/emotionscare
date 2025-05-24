
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Award, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <Users className="h-8 w-8 text-blue-500" />, value: "10K+", label: "Utilisateurs actifs" },
    { icon: <Award className="h-8 w-8 text-green-500" />, value: "95%", label: "Satisfaction client" },
    { icon: <Globe className="h-8 w-8 text-purple-500" />, value: "25+", label: "Pays couverts" },
    { icon: <Heart className="h-8 w-8 text-red-500" />, value: "1M+", label: "Sessions de bien-être" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              À propos d'EmotionsCare
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pionniers du bien-être émotionnel numérique, nous révolutionnons la façon 
              dont les individus et les organisations prennent soin de leur santé mentale.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{stat.icon}</div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Notre Histoire</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Fondée en 2023, EmotionsCare est née de la conviction que le bien-être émotionnel 
                  est un droit fondamental qui devrait être accessible à tous. Notre équipe 
                  multidisciplinaire combine expertise technologique et connaissance approfondie 
                  de la psychologie pour créer des solutions innovantes.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aujourd'hui, nous accompagnons des milliers d'utilisateurs et des dizaines 
                  d'entreprises dans leur parcours vers un meilleur équilibre émotionnel, 
                  en utilisant l'intelligence artificielle comme catalyseur de transformation positive.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
