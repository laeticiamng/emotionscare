
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header & Branding */}
      <header className="w-full pt-16 pb-10 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4 tracking-tight">
          Emotions<span className="text-primary">Care</span>
          <span className="text-sm align-super">™</span>
        </h1>
        <h2 className="text-lg md:text-2xl text-muted-foreground mb-3">
          par ResiMax<span className="text-xs align-super">™</span> 4.0
        </h2>
        <p className="text-base md:text-xl italic font-light max-w-2xl mx-auto text-muted-foreground">
          Votre bien-être au cœur de votre journée professionnelle
        </p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* User Card */}
            <div className="premium-card interactive-card">
              <div className="flex flex-col items-center p-8 md:p-10">
                <div className="p-6 rounded-full bg-primary/10 mb-6">
                  <User size={48} className="text-primary" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">Espace Collaborateur</h2>
                
                <ul className="space-y-4 mb-8 w-full max-w-xs">
                  {["Check-in émotionnel individuel", "Social Cocoon 100% positif", "Coach IA personnalisé", "Gamification & Daily Streak"].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="rounded-full bg-primary/10 p-1.5 mt-0.5 flex-shrink-0">
                        <Check size={16} className="text-primary" />
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full max-w-xs"
                  onClick={() => navigate('/login')}
                  size="lg"
                  variant="premium"
                >
                  Me connecter
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
            
            {/* Admin Card */}
            <div className="premium-card interactive-card">
              <div className="flex flex-col items-center p-8 md:p-10">
                <div className="p-6 rounded-full bg-primary/10 mb-6">
                  <Shield size={48} className="text-primary" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">Espace Direction</h2>
                
                <ul className="space-y-4 mb-8 w-full max-w-xs">
                  {["Indicateurs anonymisés", "Journal de bord global", "Outils prédictifs d'action", "Analyse 360° du bien-être"].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="rounded-full bg-primary/10 p-1.5 mt-0.5 flex-shrink-0">
                        <Check size={16} className="text-primary" />
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full max-w-xs"
                  onClick={() => navigate('/admin-login')}
                  size="lg"
                  variant={theme === 'dark' ? 'outline' : 'default'}
                >
                  Connexion Admin
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Presentation & Values Section */}
          <div className="w-full glass-card p-8 md:p-10 mb-12">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Pourquoi EmotionsCare<span className="text-xs align-super">™</span> ?
            </h2>
            
            <p className="text-center text-lg mb-10 max-w-4xl mx-auto">
              Parce que chaque collaborateur mérite d'être entendu, compris et soutenu dans son quotidien professionnel.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="premium-card p-6 text-center">
                <h3 className="font-medium text-xl mb-3">Confidentialité & Sécurité</h3>
                <p className="text-muted-foreground">Chiffrement AES-256, RGPD compliant, données anonymisées</p>
              </div>
              
              <div className="premium-card p-6 text-center">
                <h3 className="font-medium text-xl mb-3">Engagement Ludique</h3>
                <p className="text-muted-foreground">Daily Streak, badges, défis et récompenses personnalisés</p>
              </div>
              
              <div className="premium-card p-6 text-center">
                <h3 className="font-medium text-xl mb-3">Solutions Actionnables</h3>
                <p className="text-muted-foreground">Alertes prédictives, recommandations ciblées, rapports détaillés</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
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
