
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Prêt à transformer votre bien-être ?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Rejoignez des milliers de professionnels qui ont déjà amélioré leur santé mentale avec EmotionsCare
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/choose-mode')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="ghost" 
            onClick={() => navigate('/browsing')}
            className="text-white border-white/30 hover:bg-white/10 px-8 py-4 text-lg"
          >
            Découvrir la démo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
