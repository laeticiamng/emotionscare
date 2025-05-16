
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 opacity-90"></div>
          
          {/* Content */}
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Prêt à améliorer votre bien-être émotionnel ?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg mb-8 text-blue-50"
              >
                Rejoignez notre communauté et découvrez des outils personnalisés pour mieux comprendre et gérer vos émotions au quotidien.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-white hover:bg-blue-50 text-blue-700 px-8 py-6 text-lg"
                >
                  S'inscrire gratuitement
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="lg"
                  className="border-white hover:bg-white/10 text-white px-8 py-6 text-lg"
                >
                  Se connecter
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-blue-400/30 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 rounded-full bg-blue-400/20 translate-x-1/3 translate-y-1/3"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
