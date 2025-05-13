
import React from 'react';
import { ThumbsUp, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-primary/10 rounded-2xl p-8 md:p-12 mb-16 transform transition-all duration-500 hover:bg-primary/15 hover:shadow-xl overflow-hidden relative border-2 border-primary/20">
      {/* Éléments décoratifs animés */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/20 animate-float"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-primary/15 animate-float-delay"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="flex-1 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Améliorez votre bien-être dès aujourd'hui</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Rejoignez notre communauté d'utilisateurs qui ont trouvé un meilleur équilibre émotionnel grâce à EmotionsCare.
          </p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <Button 
              onClick={() => navigate('/login')} 
              size="lg"
              className="w-full md:w-auto flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <User className="h-5 w-5" />
              Accès Particulier
            </Button>
            <Button 
              onClick={() => navigate('/business')} 
              variant="outline"
              size="lg"
              className="w-full md:w-auto flex items-center gap-2 border-2 hover:bg-secondary/20 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              <Building className="h-5 w-5" />
              Accès Entreprise
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="w-full max-w-md aspect-video bg-gradient-to-br from-primary/50 to-primary/30 rounded-xl flex items-center justify-center transform transition-all duration-500 hover:scale-[1.03] hover:shadow-lg border border-primary/20">
            <ThumbsUp className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
