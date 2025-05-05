
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, ArrowRight, Check } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#E8F1FA]/40">
      {/* Header & Branding */}
      <header className="w-full pt-12 pb-8 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#1B365D] mb-3">
          EmotionsCare<span className="text-sm align-super">™</span>
        </h1>
        <h2 className="text-lg md:text-xl text-slate-600 mb-2">
          par ResiMax<span className="text-xs align-super">™</span> 4.0
        </h2>
        <p className="text-base md:text-lg text-slate-500 italic font-light max-w-lg mx-auto">
          Votre bien-être au cœur de votre journée professionnelle
        </p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-16">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[#E8F1FA] mb-5">
                  <User size={40} className="text-[#1B365D]" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-5 text-[#1B365D]">Espace Collaborateur</h2>
                
                <ul className="space-y-3 mb-6 w-full max-w-xs">
                  {["Check-in émotionnel individuel", "Social Cocoon 100% positif", "Coach IA personnalisé", "Gamification & Daily Streak"].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="rounded-full bg-[#E8F1FA] p-1 mt-0.5 flex-shrink-0">
                        <Check size={14} className="text-[#1B365D]" />
                      </span>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full max-w-xs bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white rounded-xl"
                  onClick={() => navigate('/login')}
                  size="lg"
                >
                  Me connecter
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            
            {/* Admin Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[#E8F1FA] mb-5">
                  <Shield size={40} className="text-[#1B365D]" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-5 text-[#1B365D]">Espace Direction</h2>
                
                <ul className="space-y-3 mb-6 w-full max-w-xs">
                  {["Indicateurs anonymisés", "Journal de bord global", "Outils prédictifs d'action", "Analyse 360° du bien-être"].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="rounded-full bg-[#E8F1FA] p-1 mt-0.5 flex-shrink-0">
                        <Check size={14} className="text-[#1B365D]" />
                      </span>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full max-w-xs bg-[#1B365D] hover:bg-[#1B365D]/90 text-white rounded-xl"
                  onClick={() => navigate('/admin-login')}
                  size="lg"
                >
                  Connexion Admin
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Presentation & Values Section */}
          <div className="w-full bg-[#EFF6FF] rounded-3xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1B365D] text-center mb-6">
              Pourquoi EmotionsCare<span className="text-xs align-super">™</span> ?
            </h2>
            
            <p className="text-center text-slate-600 mb-8 max-w-4xl mx-auto">
              Parce que chaque collaborateur mérite d'être entendu, compris et soutenu dans son quotidien professionnel.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <h3 className="font-semibold text-[#1B365D] mb-2">Confidentialité & Sécurité</h3>
                <p className="text-slate-600 text-sm">Chiffrement AES-256, RGPD compliant, données anonymisées</p>
              </div>
              
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <h3 className="font-semibold text-[#1B365D] mb-2">Engagement Ludique</h3>
                <p className="text-slate-600 text-sm">Daily Streak, badges, défis et récompenses personnalisés</p>
              </div>
              
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <h3 className="font-semibold text-[#1B365D] mb-2">Solutions Actionnables</h3>
                <p className="text-slate-600 text-sm">Alertes prédictives, recommandations ciblées, rapports détaillés</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-[#1B365D] text-white py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm mb-3 md:mb-0">© {new Date().getFullYear()} ResiMax™ – GDPR compliant</p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-white/80 hover:text-white hover:underline transition-colors">Mentions légales</a>
            <a href="#" className="text-sm text-white/80 hover:text-white hover:underline transition-colors">Support</a>
            <a href="#" className="text-sm text-white/80 hover:text-white hover:underline transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
