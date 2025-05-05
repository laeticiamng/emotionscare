
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-emerald-50 p-6">
      <div className="w-full max-w-5xl animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            <span className="text-primary">ResiMax</span>™
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre bien-être, notre priorité
          </p>
        </div>
        
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* User Card */}
          <div className="bg-[#E8DAFF] rounded-3xl p-8 shadow-sm hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-white/50 mb-4">
                <User size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Espace Collaborateur</h2>
              <p className="text-center text-muted-foreground mb-6">
                Accédez à votre tableau de bord personnel, coach IA, Social Cocoon et gamification.
              </p>
              <Button 
                className="bg-[#FF8C94] hover:bg-[#FF8C94]/90 text-white hover:shadow-[0_0_15px_rgba(255,140,148,0.5)] hover:scale-105 transition-all"
                onClick={() => navigate('/login')}
                size="lg"
              >
                Me connecter
              </Button>
            </div>
          </div>
          
          {/* Admin Card */}
          <div className="bg-[#FFF5E6] rounded-3xl p-8 shadow-sm hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-white/50 mb-4">
                <Shield size={40} className="text-[#4DD0E1]" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Espace Direction</h2>
              <p className="text-center text-muted-foreground mb-6">
                Visualisez les indicateurs globaux anonymisés et pilotez le bien-être de vos équipes.
              </p>
              <Button 
                className="bg-[#4DD0E1] hover:bg-[#4DD0E1]/90 text-white hover:shadow-[0_0_15px_rgba(77,208,225,0.5)] hover:scale-105 transition-all"
                onClick={() => navigate('/admin-login')}
                size="lg"
              >
                Connexion Admin
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Données chiffrées & RGPD compliant</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
