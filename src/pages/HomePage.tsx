
import React from 'react';
import { motion } from 'framer-motion';
import CallToAction from '@/components/home/CallToAction';
import HeroVideo from '@/components/HeroVideo';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SecurityCertifications from '@/components/SecurityCertifications';
import MainLayout from '@/components/layout/MainLayout';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                EmotionsCare
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
                Analysez, comprenez et améliorez votre bien-être émotionnel avec nos outils innovants
              </p>
            </motion.div>

            {/* Hero Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <HeroVideo />
            </motion.div>

            {/* Call to Actions - Seulement Particulier et Entreprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20"
            >
              <CallToAction type="personal" />
              <CallToAction type="business" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Security Certifications */}
        <SecurityCertifications />
      </div>
    </MainLayout>
  );
};

export default HomePage;
