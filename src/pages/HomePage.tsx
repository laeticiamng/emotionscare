
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { EnhancedSkipLinks } from '@/components/ui/enhanced-accessibility';
import OptimizedHeroSection from '@/components/home/OptimizedHeroSection';
import OptimizedFeaturesSection from '@/components/home/OptimizedFeaturesSection';
import CtaSection from '@/components/home/CtaSection';
import '@/styles/optimized-animations.css';

const HomePage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.3,
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <EnhancedSkipLinks />
      
      {/* Optimized Hero Section */}
      <OptimizedHeroSection />
      
      {/* Optimized Features Section */}
      <OptimizedFeaturesSection />
      
      {/* CTA Section - Keep original for now */}
      <CtaSection />
    </motion.div>
  );
};

export default HomePage;
