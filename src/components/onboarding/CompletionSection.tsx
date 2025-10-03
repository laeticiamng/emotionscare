
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Music, Brain, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MoodBasedRecommendations from '@/components/music/MoodBasedRecommendations';

interface CompletionSectionProps {
  onFinish: () => void;
  onBack: () => void;
  emotion: string;
  responses: Record<string, any>;
  loading: boolean;
}

const CompletionSection: React.FC<CompletionSectionProps> = ({
  onFinish,
  onBack,
  emotion,
  responses,
  loading
}) => {
  const features = responses.selected_features || [];
  const preferences = responses.personalization_preferences || {};
  
  // Get summary based on emotional profile
  const getSummary = () => {
    switch (emotion) {
      case 'joy':
      case 'energetic':
        return "Votre profil énergique suggère une excellente disposition pour explorer pleinement les fonctionnalités d'EmotionsCare !";
      case 'calm':
      case 'focus':
        return "Votre profil serein indique une excellente disposition pour une utilisation réfléchie et concentrée d'EmotionsCare.";
      case 'sad':
      case 'anxiety':
      case 'stress':
        return "Votre profil émotionnel actuel nous permet de vous proposer des fonctionnalités qui pourront vous aider à retrouver plus de sérénité.";
      default:
        return "Votre profil émotionnel nous permet de vous offrir une expérience personnalisée pour répondre à vos besoins spécifiques.";
    }
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Votre expérience personnalisée est prête !
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {getSummary()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Votre profil émotionnel</h2>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md mb-4">
              <p className="font-medium">Émotion principale : <span className="text-primary">{emotion}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  Profil personnalisé
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Adaptation musicale
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Recommandations sur mesure
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Analyse émotionnelle complète</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Personnalisation de l'interface</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Configuration des notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Fonctionnalités adaptées à vos préférences</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {features.includes('music') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MoodBasedRecommendations 
              mood={emotion}
              intensity={70}
              standalone={true}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center text-center py-8"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <LineChart className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            Configuration réussie !
          </h2>
          
          <p className="text-muted-foreground mb-8 max-w-md">
            Votre espace EmotionsCare est maintenant prêt à vous offrir une expérience 
            entièrement personnalisée. Explorez vos nouvelles fonctionnalités !
          </p>
          
          <Button 
            size="lg" 
            onClick={onFinish}
            disabled={loading}
            className="min-w-56"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalisation...
              </>
            ) : (
              "Accéder à mon espace"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompletionSection;
