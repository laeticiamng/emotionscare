
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-24 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à prendre soin de votre bien-être émotionnel ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de professionnels de santé qui utilisent déjà EmotionsCare 
            pour améliorer leur qualité de vie au travail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/choose-mode">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
              Voir la démo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
