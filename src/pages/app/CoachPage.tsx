import React, { useState } from 'react';
import { MessageCircle, Sparkles, RefreshCw, Heart, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const CoachPage = () => {
  const [currentAdvice, setCurrentAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adviceHistory, setAdviceHistory] = useState<string[]>([]);

  // Conseils prédéfinis (fallback et exemples)
  const fallbackAdvices = [
    'Vous allez y arriver.',
    'Respirez profondément.',
    'Un pas à la fois.',
    'Soyez bienveillant avec vous.',
    'Pause de 2 minutes.',
    'Buvez un verre d\'eau.',
    'Regardez par la fenêtre.',
    'Écoutez votre corps.',
    'Tout va bien se passer.',
    'Prenez votre temps.',
    'Vous êtes plus fort que vous ne le pensez.',
    'Faites une pause thé.',
    'Sortez prendre l\'air.',
    'Écrivez trois mots.',
    'Souriez doucement.',
    'Posez vos épaules.',
    'Détendez votre mâchoire.',
    'Marchez 50 pas.',
    'Comptez jusqu\'à dix.',
    'Fermez les yeux 30 sec.'
  ];

  const getRandomAdvice = () => {
    const available = fallbackAdvices.filter(advice => !adviceHistory.includes(advice));
    if (available.length === 0) {
      // Reset history if all used
      setAdviceHistory([]);
      return fallbackAdvices[Math.floor(Math.random() * fallbackAdvices.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  };

  const generateAdvice = async () => {
    setIsLoading(true);
    
    try {
      // Simulation d'appel API avec modération
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation de refus aléatoire (10% des cas)
      if (Math.random() < 0.1) {
        throw new Error('Requête refusée par la modération');
      }

      // Génération d'un conseil
      const advice = getRandomAdvice();
      setCurrentAdvice(advice);
      setAdviceHistory(prev => [...prev.slice(-9), advice]); // Garder les 10 derniers
      
      toast.success('Nouveau conseil reçu', {
        description: 'Prenez le temps de l\'appliquer',
        duration: 2000
      });

    } catch (error) {
      // Fallback en cas d'erreur
      const fallbackAdvice = 'Vous allez y arriver.';
      setCurrentAdvice(fallbackAdvice);
      
      toast.info('Conseil de sécurité', {
        description: 'Message généré localement',
        duration: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    {
      icon: Heart,
      title: 'Bienveillance',
      description: 'Conseils pour l\'auto-compassion',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Lightbulb,
      title: 'Clarté',
      description: 'Micro-actions pour avancer',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Sparkles,
      title: 'Énergie',
      description: 'Petits boosts quotidiens',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Coach 1-minute
          </h1>
          <p className="text-muted-foreground">
            Des micro-conseils bienveillants pour votre quotidien
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conseil principal */}
          <div className="space-y-6">
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-muted min-h-[300px] flex flex-col justify-center">
              {currentAdvice ? (
                <div className="space-y-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <blockquote className="text-2xl font-medium text-foreground leading-relaxed">
                    "{currentAdvice}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground">
                    Prenez quelques instants pour appliquer ce conseil
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-primary/60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Prêt pour un conseil ?</h3>
                    <p className="text-muted-foreground">
                      Recevez un micro-conseil personnalisé en moins d'une minute
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Bouton principal */}
            <div className="text-center">
              <Button 
                onClick={generateAdvice}
                disabled={isLoading}
                size="lg"
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Nouveau conseil
                  </>
                )}
              </Button>
              
              {currentAdvice && !isLoading && (
                <Button 
                  onClick={generateAdvice}
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full max-w-xs"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Autre conseil
                </Button>
              )}
            </div>
          </div>

          {/* Informations et catégories */}
          <div className="space-y-6">
            {/* Catégories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Types de conseils</h3>
              <div className="grid gap-3">
                {categories.map((category, index) => (
                  <Card key={index} className="p-4 bg-card/30 backdrop-blur-sm border-muted">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{category.title}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comment ça marche */}
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4">Comment ça fonctionne</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Conseils générés en moins de 7 mots</li>
                <li>• Messages bienveillants et non-médicaux</li>
                <li>• Modération automatique pour votre sécurité</li>
                <li>• Actions simples et réalisables immédiatement</li>
                <li>• Renouvellement illimité selon vos besoins</li>
              </ul>
            </Card>

            {/* Bénéfices */}
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4">Pourquoi utiliser Coach ?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Guidance rapide dans les moments difficiles</li>
                <li>• Rappels bienveillants pour prendre soin de soi</li>
                <li>• Actions concrètes sans surcharge mentale</li>
                <li>• Alternative douce aux longues réflexions</li>
              </ul>
            </Card>

            {/* Sécurité */}
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted border-amber-200/20">
              <h3 className="font-semibold mb-4 text-amber-700 dark:text-amber-300">Important</h3>
              <p className="text-sm text-muted-foreground">
                Les conseils du Coach sont des suggestions générales de bien-être. 
                En cas de détresse importante, n'hésitez pas à consulter un professionnel de santé.
              </p>
            </Card>
          </div>
        </div>

        {/* Historique récent */}
        {adviceHistory.length > 0 && (
          <div className="mt-8">
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-4">Derniers conseils reçus</h3>
              <div className="grid gap-2">
                {adviceHistory.slice(-3).reverse().map((advice, index) => (
                  <div key={index} className="text-sm text-muted-foreground p-2 rounded bg-muted/30">
                    "{advice}"
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachPage;