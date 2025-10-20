// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Calendar } from 'lucide-react';
import { Segment } from '@/store/marketing.store';
import { useRouter } from '@/hooks/router';
import { logger } from '@/lib/logger';

interface CTAStripProps {
  segment: Segment;
}

/**
 * Bande CTA finale adaptée au segment
 */
export const CTAStrip: React.FC<CTAStripProps> = ({ segment }) => {
  const router = useRouter();

  const handleCTA = (action: string) => {
    // Analytics tracking
    logger.info('Final CTA clicked', { action, segment }, 'UI');
    
    switch (action) {
      case 'signup':
        router.push(`/signup?segment=${segment}`);
        break;
      case 'demo':
        router.push('/demo');
        break;
      case 'trial':
        router.push(`/trial?segment=${segment}`);
        break;
      case 'contact':
        router.push('/contact');
        break;
    }
  };

  if (segment === 'b2b') {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre culture d'entreprise ?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Rejoignez les entreprises qui ont choisi l'approche bienveillante 
              du management et du bien-être au travail.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleCTA('demo')}
                className="text-lg px-8"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Réserver une démo
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCTA('contact')}
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Parler à un expert
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-blue-100">
              <span>✓ Installation en 48h</span>
              <span>✓ Formation incluse</span>
              <span>✓ Support dédié</span>
              <span>✓ Essai 30 jours offert</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // B2C CTA
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Commencez votre parcours bien-être dès aujourd'hui
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Rejoignez des milliers de personnes qui cultivent leur équilibre 
            émotionnel avec EmotionsCare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleCTA('signup')}
              className="text-lg px-8"
            >
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleCTA('trial')}
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Play className="w-5 h-5 mr-2" />
              Essai gratuit 30 jours
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-purple-100">
            <span>✓ Pas de carte bancaire</span>
            <span>✓ Accès immédiat</span>
            <span>✓ Toutes les fonctionnalités</span>
            <span>✓ Annulation à tout moment</span>
          </div>
        </div>
      </div>
    </div>
  );
};