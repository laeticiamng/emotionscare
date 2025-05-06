
import React, { useEffect } from 'react';
import { Shield, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import RoleCard from '@/components/home/RoleCard';
import ValueProposition from '@/components/home/ValueProposition';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

const Index = () => {
  const { theme } = useTheme();
  
  // Effet pour définir la classe sur l'élément body pour retirer les marges par défaut
  useEffect(() => {
    document.body.classList.add('home-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);
  
  const userFeatures = [
    "Check-in émotionnel individuel",
    "Social Cocoon 100% positif",
    "Coach IA personnalisé",
    "Gamification & Daily Streak"
  ];
  
  const adminFeatures = [
    "Indicateurs anonymisés",
    "Journal de bord global",
    "Outils prédictifs d'action",
    "Analyse 360° du bien-être"
  ];
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Fond avec gradient subtil */}
      <div className="absolute inset-0 -z-10">
        <div className={`w-full h-full ${
          theme === 'dark' ? 'bg-gradient-to-br from-[#1F2430] to-[#2A303D]' :
          theme === 'pastel' ? 'bg-gradient-to-br from-blue-50 to-blue-100/70' :
          'bg-gradient-to-br from-white to-gray-50'
        }`}></div>
      </div>
      
      {/* Header & Branding - Plus d'impact visuel */}
      <header className="w-full py-16 md:py-20 lg:py-24 text-center animate-fade-in max-w-[1400px] mx-auto px-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight heading-elegant">
          Emotions<span className="text-primary">Care</span>
          <span className="text-sm align-super">™</span>
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          par ResiMax<span className="text-xs align-super">™</span> 4.0
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl italic font-light max-w-3xl mx-auto text-muted-foreground text-balance">
          Votre bien-être au cœur de votre journée professionnelle
        </p>
        
        <div className="mt-10">
          <ThemeSwitcher variant="outline" size="default" showLabel={true} />
        </div>
      </header>
      
      {/* Main Content - Meilleure utilisation de l'espace */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 lg:p-12">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Cards Container - Espacement optimisé */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-20">
            {/* User Card */}
            <RoleCard
              title="Espace Collaborateur"
              icon={User}
              features={userFeatures}
              type="user"
            />
            
            {/* Admin Card */}
            <RoleCard
              title="Espace Direction"
              icon={Shield}
              features={adminFeatures}
              type="admin"
            />
          </div>
          
          {/* Value Proposition Section - Plus d'impact */}
          <ValueProposition />
        </div>
      </main>
      
      {/* Footer - Style premium */}
      <footer className="w-full bg-primary text-primary-foreground py-8 px-4 mt-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <p className="mb-4 md:mb-0 font-medium">© {new Date().getFullYear()} ResiMax™ – GDPR compliant</p>
          <div className="flex space-x-8">
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Mentions légales</a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Support</a>
            <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
