import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowRight, Sparkles, Heart, Target } from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function Hero() {
  const navAction = useNavAction();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container relative px-4 py-20 text-center space-y-8">
        {/* Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Nouvelle plateforme de bien-être émotionnel
          </Badge>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Votre compagnon pour le
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {" "}bien-être émotionnel
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez vos émotions, apprenez à les gérer, et préparez vos examens médicaux 
            avec notre plateforme complète alliant technologie et psychologie.
          </p>
        </div>

        {/* Features highlights */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-primary mr-2" />
            Scan émotionnel IA
          </div>
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            Musicothérapie personnalisée
          </div>
          <div className="flex items-center">
            <Target className="w-5 h-5 text-green-500 mr-2" />
            Préparation ECOS & EDN
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={() => navAction({ type: 'route', to: '/scan' })}
          >
            <Brain className="w-5 h-5 mr-2" />
            Commencer un scan émotionnel
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="px-8 py-6 text-lg"
            onClick={() => navAction({ type: 'modal', id: 'demo-video' })}
          >
            Voir la démo
          </Button>
        </div>

        {/* Social proof */}
        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Rejoignez plus de 10 000 étudiants qui améliorent leur bien-être
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* University logos would go here */}
            <div className="text-xs">Université Paris Descartes</div>
            <div className="text-xs">Université de Lyon</div>
            <div className="text-xs">Université de Bordeaux</div>
          </div>
        </div>
      </div>
    </section>
  );
}