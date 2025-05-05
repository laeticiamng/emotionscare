
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC] bg-gradient-radial from-white to-[#E8F1FA]">
      {/* Header & Branding */}
      <header className="w-full pt-12 pb-8 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#1B365D] mb-2">
          EmotionsCare<span className="text-sm align-super">™</span>
        </h1>
        <h2 className="text-lg md:text-xl text-slate-600 mb-1">
          par ResiMax<span className="text-xs align-super">™</span>
        </h2>
        <p className="text-base md:text-lg text-slate-500 italic font-light">
          Votre bien-être au cœur de votre journée
        </p>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[#E8F1FA]/50 mb-4">
                  <User size={40} className="text-[#1B365D]" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-4 text-[#1B365D]">Espace Collaborateur</h2>
                
                <div className="text-center text-slate-600 mb-6 space-y-1">
                  <p>Accédez à vos outils bien-être :</p>
                  <ul className="text-left list-none space-y-1 mx-auto w-fit">
                    <li>• Check-in émotionnel individuel</li>
                    <li>• Social Cocoon 100 % positif</li>
                    <li>• Coach IA personnalisé</li>
                    <li>• Gamification & Daily Streak</li>
                  </ul>
                </div>
                
                <Button 
                  className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white hover:shadow-[0_0_15px_rgba(168,230,207,0.5)] hover:scale-[1.03] transition-all duration-200"
                  onClick={() => navigate('/login')}
                  size="lg"
                >
                  Me connecter
                </Button>
              </div>
            </div>
            
            {/* Admin Card */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center">
                <div className="p-4 rounded-full bg-[#E8F1FA]/50 mb-4">
                  <Shield size={40} className="text-[#1B365D]" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-4 text-[#1B365D]">Espace Direction</h2>
                
                <div className="text-center text-slate-600 mb-6 space-y-1">
                  <p>Pilotez le bien-être collectif :</p>
                  <ul className="text-left list-none space-y-1 mx-auto w-fit">
                    <li>• Indicateurs anonymisés</li>
                    <li>• Journal de bord global</li>
                    <li>• Social Cocoon anonymisé</li>
                    <li>• Outils d'action & notifications prédictives</li>
                  </ul>
                </div>
                
                <Button 
                  className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white hover:shadow-[0_0_15px_rgba(168,230,207,0.5)] hover:scale-[1.03] transition-all duration-200"
                  onClick={() => navigate('/admin-login')}
                  size="lg"
                >
                  Connexion Admin
                </Button>
              </div>
            </div>
          </div>
          
          {/* Presentation & Values Section */}
          <div className="w-full bg-[#EFF6FF] rounded-t-3xl p-8 mb-12">
            <h2 className="text-3xl font-semibold text-[#1B365D] text-center mb-4">
              Pourquoi ÉmotionCare<span className="text-xs align-super">™</span> ?
            </h2>
            
            <p className="text-center text-slate-600 mb-8 max-w-4xl mx-auto">
              Parce que chaque collaborateur mérite d'être entendu, compris et soutenu.<br/>
              Notre plateforme conjugue IA empathique, réseau social 100 % positif et gamification pour créer<br className="hidden md:block" />
              une expérience addictive, sécurisée et bienveillante, aussi bien pour l'utilisateur que pour la direction.
            </p>
            
            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-4">
                <h3 className="font-semibold text-[#1B365D] mb-2">Confidentialité & Sécurité</h3>
                <p className="text-slate-600 text-sm">chiffrement AES-256, RGPD compliant</p>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-semibold text-[#1B365D] mb-2">Addictive & Ludique</h3>
                <p className="text-slate-600 text-sm">notifications douces, Daily Streak, badges</p>
              </div>
              
              <div className="text-center p-4">
                <h3 className="font-semibold text-[#1B365D] mb-2">Actionnable</h3>
                <p className="text-slate-600 text-sm">alertes prédictives, suggestions d'ateliers, reporting</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-[#1B365D] text-white py-6 px-4">
        <div className="container mx-auto text-center text-sm">
          <p className="mb-2">© 2025 ResiMax™ – Données chiffrées, Supabase Auth & GDPR compliant.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:underline focus:outline-white focus:outline-offset-2">Mentions légales</a>
            <a href="#" className="hover:underline focus:outline-white focus:outline-offset-2">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
