
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedLoginForm from '@/components/auth/EnhancedLoginForm';
import PageTransition from '@/components/transitions/PageTransition';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';

const B2CLogin: React.FC = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Connexion | EmotionsCare</title>
        <meta name="description" content="Connectez-vous à votre espace personnel EmotionsCare" />
      </Helmet>
      
      {/* Dynamic animated background */}
      <AnimatedBackground type="gradient" intensity="low" />
      
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher variant="outline" />
      </div>
      
      {/* Login form */}
      <EnhancedLoginForm />
    </PageTransition>
  );
};

export default B2CLogin;
