
import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedRegisterForm from '@/components/auth/EnhancedRegisterForm';
import PageTransition from '@/components/transitions/PageTransition';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';

const B2CRegister: React.FC = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Inscription | EmotionsCare</title>
        <meta name="description" content="Créez un compte et rejoignez la communauté EmotionsCare" />
      </Helmet>
      
      {/* Dynamic animated background */}
      <AnimatedBackground type="gradient" intensity="low" />
      
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher variant="outline" />
      </div>
      
      {/* Register form */}
      <EnhancedRegisterForm />
    </PageTransition>
  );
};

export default B2CRegister;
