
import React, { useEffect } from 'react';
import { Shield, User, Music, HeartPulse, MessageCircle, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import RoleCard from '@/components/home/RoleCard';
import ValueProposition from '@/components/home/ValueProposition';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import ModulesSection from '@/components/home/ModulesSection';
import InnovationTabs from '@/components/home/InnovationTabs';

const Index = () => {
  const { theme } = useTheme();
  
  // Effect to set class on body element to remove default margins
  useEffect(() => {
    document.body.classList.add('home-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);
  
  const userFeatures = [
    "Check-in émotionnel quotidien",
    "Musicothérapie adaptative",
    "Coach IA personnalisé",
    "Journal émotionnel guidé"
  ];
  
  const adminFeatures = [
    "Tableau de bord analytique",
    "Prédiction turnover émotionnel",
    "Analyse ROI bien-être",
    "Suivi anonymisé des équipes"
  ];
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 -z-10">
        <div className={`w-full h-full ${
          theme === 'dark' ? 'bg-gradient-to-br from-[#22252F] to-[#2D3440]' : // Warmer dark theme
          theme === 'pastel' ? 'bg-gradient-to-br from-blue-50 to-indigo-100/60' : // More vibrant pastel
          'bg-gradient-to-br from-white to-gray-50/80' // Warmer light tone
        }`}></div>
      </div>
      
      {/* Header & Branding - More visual impact */}
      <header className="w-full py-16 md:py-20 lg:py-24 text-center animate-fade-in max-w-[1400px] mx-auto px-6">
        <div className="flex justify-center mb-6">
          <img 
            src="/images/emotionscare-logo.svg" 
            alt="EmotionsCare Logo" 
            className="h-24 md:h-28 lg:h-32 w-auto"
          />
        </div>
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
      
      {/* Main Content - Better space utilization */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 lg:p-12">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Modules Section */}
          <ModulesSection />
          
          {/* Innovations - New section */}
          <div className="mt-16">
            <InnovationTabs />
          </div>
          
          {/* Cards Container - Optimized spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 my-12">
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
          
          {/* Featured Modules Section - Highlighting key innovations */}
          <div className="card-premium p-10 md:p-14 mb-12 rounded-3xl shadow-premium">
            <h2 className="text-3xl font-semibold text-center mb-10 heading-elegant">
              Innovations Exclusives
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background/90 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <Music className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-medium">Musicothérapie Adaptative</h3>
                </div>
                <p className="text-muted-foreground">Génération musicale IA en temps réel adaptée à votre état émotionnel pour améliorer votre bien-être.</p>
              </div>
              
              <div className="bg-background/90 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-medium">Jumeau Émotionnel</h3>
                </div>
                <p className="text-muted-foreground">Votre avatar IA personnel qui apprend de vos émotions et vous propose un programme sur mesure.</p>
              </div>
              
              <div className="bg-background/90 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-medium">Coach IA</h3>
                </div>
                <p className="text-muted-foreground">Assistant intelligent qui vous guide avec des micro-exercices adaptés à votre état émotionnel.</p>
              </div>
            </div>
          </div>
          
          {/* Value Proposition Section */}
          <ValueProposition />
        </div>
      </main>
    </div>
  );
};

export default Index;
