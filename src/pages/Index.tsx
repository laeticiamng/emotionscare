
import React from 'react';
import { Shield, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import RoleCard from '@/components/home/RoleCard';
import ValueProposition from '@/components/home/ValueProposition';

const Index = () => {
  const { theme } = useTheme();
  
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
    <div className="min-h-screen flex flex-col">
      {/* Header & Branding */}
      <header className="w-full pt-16 pb-10 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4 tracking-tight heading-elegant">
          Emotions<span className="text-primary">Care</span>
          <span className="text-sm align-super">™</span>
        </h1>
        <h2 className="text-lg md:text-2xl text-muted-foreground mb-3">
          par ResiMax<span className="text-xs align-super">™</span> 4.0
        </h2>
        <p className="text-base md:text-xl italic font-light max-w-2xl mx-auto text-muted-foreground text-balance">
          Votre bien-être au cœur de votre journée professionnelle
        </p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
        <div className="premium-container">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
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
          
          {/* Value Proposition Section */}
          <ValueProposition />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-primary text-primary-foreground py-8 px-4">
        <div className="premium-container flex flex-col md:flex-row items-center justify-between">
          <p className="mb-4 md:mb-0">© {new Date().getFullYear()} ResiMax™ – GDPR compliant</p>
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
