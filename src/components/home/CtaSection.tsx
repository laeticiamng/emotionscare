
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Essai gratuit - Aucune carte bancaire requise
          </div>
          
          <h2 className="text-5xl font-bold mb-6">
            Commencez votre transformation
            <span className="block text-primary">dès aujourd'hui</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Rejoignez les milliers de professionnels qui ont déjà transformé leur bien-être émotionnel avec EmotionsCare
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/choose-mode')}
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/browsing')}
            >
              Découvrir la plateforme
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Satisfaction client</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15K+</div>
              <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support IA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
