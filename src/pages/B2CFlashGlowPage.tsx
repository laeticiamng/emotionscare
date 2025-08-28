import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Sparkles, Sun, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingState, ErrorState, EmptyState, useLoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CFlashGlowPage: React.FC = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingState type="dashboard" />;
  if (loadingState === 'error') return <ErrorState error="Erreur de chargement" />;

  const handleFlashGlow = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <Zap className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Flash Glow</h1>
          <p className="text-muted-foreground">Boost instantané d'énergie positive</p>
        </div>
      </div>

      <motion.div
        animate={isGlowing ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`relative ${isGlowing ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : ''}`}
      >
        <Card className={`${isGlowing ? 'shadow-2xl border-yellow-200' : ''} transition-all duration-500`}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className={`h-6 w-6 ${isGlowing ? 'text-yellow-500 animate-pulse' : 'text-muted-foreground'}`} />
              Zone d'Énergie Flash
              <Sparkles className={`h-6 w-6 ${isGlowing ? 'text-yellow-500 animate-pulse' : 'text-muted-foreground'}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <motion.div
                animate={isGlowing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center ${
                  isGlowing 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-lg' 
                    : 'bg-muted'
                } transition-all duration-500`}
              >
                {isGlowing ? (
                  <Sun className="h-16 w-16 text-white animate-spin" />
                ) : (
                  <Zap className="h-16 w-16 text-muted-foreground" />
                )}
              </motion.div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-lg">
                {isGlowing 
                  ? "✨ Énergie en cours de rechargement... ✨"
                  : "Prêt pour un boost d'énergie instantané ?"
                }
              </p>
              
              <Button 
                onClick={handleFlashGlow}
                disabled={isGlowing}
                size="lg"
                className={`px-8 py-3 ${isGlowing ? 'animate-pulse' : ''}`}
              >
                {isGlowing ? (
                  <>
                    <Heart className="h-5 w-5 mr-2 animate-pulse" />
                    Recharge en cours...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Flash Glow Maintenant
                  </>
                )}
              </Button>
            </div>

            {isGlowing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Énergie +95%
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <Heart className="h-3 w-3 mr-1" />
                    Motivation +87%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "L'énergie positive circule en vous. Respirez profondément et ressentez cette vague de bien-être."
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-sm">Boost Instantané</h3>
                <p className="text-xs text-muted-foreground">3 secondes d'énergie pure</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-sm">Éclat Naturel</h3>
                <p className="text-xs text-muted-foreground">Réveillez votre lumière intérieure</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="font-semibold text-sm">Glow Effect</h3>
                <p className="text-xs text-muted-foreground">Rayonnez de positivité</p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CFlashGlowPage;