import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles, Users } from 'lucide-react';
import { Segment } from '@/store/marketing.store';
import { useRouter } from '@/hooks/router';

interface HeroProps {
  segment: Segment;
}

/**
 * Section hero adaptée au segment B2C/B2B
 */
export const Hero: React.FC<HeroProps> = ({ segment }) => {
  const router = useRouter();

  const handleCTA = (action: string) => {
    // Analytics tracking
    console.log(`CTA clicked: ${action} (${segment})`);
    
    switch (action) {
      case 'signup':
        router.push(`/signup?segment=${segment}`);
        break;
      case 'demo':
        router.push('/demo');
        break;
      case 'discover':
        router.push(`/${segment}`);
        break;
      case 'login_rh':
        router.push('/login/rh');
        break;
      case 'login_collab':
        router.push('/login/collaborateur');
        break;
    }
  };

  if (segment === 'b2b') {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Users className="w-3 h-3 mr-1" />
              Solution RH & Bien-être
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Transformez le{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                bien-être
              </span>
              {' '}de vos équipes
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Heatmap anonymisée du moral d'équipe, outils d'accompagnement personnalisés, 
              et dashboard RH pour un management bienveillant et efficace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => handleCTA('demo')}
                className="text-lg px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Demander une démo
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleCTA('login_rh')}
                  className="flex-1"
                >
                  Espace RH
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleCTA('login_collab')}
                  className="flex-1"
                >
                  Espace Collaborateur
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                RGPD Compliant
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full" />
                Anonymat Garanti
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full" />
                Accessible AA
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // B2C Hero
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Sparkles className="w-3 h-3 mr-1" />
            Bien-être Personnel
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Votre{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              équilibre
            </span>
            {' '}émotionnel au quotidien
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Flash Glow, Screen-Silk, VR immersif, journal personnel... 
            Des micro-moments de bien-être adaptés à votre rythme de vie.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => handleCTA('signup')}
              className="text-lg px-8"
            >
              Créer mon compte
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCTA('discover')}
            >
              <Play className="w-5 h-5 mr-2" />
              Découvrir gratuitement
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Gratuit 30 jours
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              Données Privées
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Sans Engagement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};