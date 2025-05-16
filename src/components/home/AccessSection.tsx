
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Music, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const AccessSection = () => {
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: "Analyse émotionnelle",
      description: "Notre technologie avancée analyse votre voix pour comprendre vos émotions et vous aider à les gérer efficacement."
    },
    {
      icon: <Music className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: "Musique adaptative",
      description: "Écoutez des compositions musicales conçues pour répondre à votre état émotionnel et améliorer votre bien-être."
    },
    {
      icon: <Heart className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: "Suivi du bien-être",
      description: "Suivez l'évolution de votre état émotionnel au fil du temps et identifiez les tendances pour mieux vous comprendre."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: "Journal émotionnel",
      description: "Tenez un journal de vos émotions et recevez des recommandations personnalisées pour améliorer votre quotidien."
    }
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-lg text-blue-700/80 dark:text-blue-400/80">
            Découvrez comment notre plateforme peut vous aider à mieux comprendre et gérer vos émotions au quotidien.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)' }}
              className="transition-all duration-300"
            >
              <Card className="h-full border-blue-100 dark:border-blue-900/20 bg-white dark:bg-gray-800/90">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">
                    {feature.title}
                  </h3>
                  <p className="text-blue-600/70 dark:text-blue-400/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
