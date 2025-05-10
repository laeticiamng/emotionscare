
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Sparkles, Heart, Wand2 } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const PremiumFeatures = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const handleEmotionalCamouflageChange = (checked: boolean) => {
    updatePreferences({ emotionalCamouflage: checked });
    
    toast({
      title: checked ? "Mode caméléon activé" : "Mode caméléon désactivé",
      description: checked 
        ? "L'interface s'adaptera automatiquement à votre état émotionnel" 
        : "L'interface ne changera plus automatiquement selon votre humeur"
    });
  };
  
  const handleDuoModeChange = (checked: boolean) => {
    updatePreferences({ duoModeEnabled: checked });
    
    toast({
      title: checked ? "Cercle de confiance activé" : "Cercle de confiance désactivé",
      description: checked 
        ? "Vous pouvez maintenant partager certaines de vos émotions avec une personne de confiance" 
        : "Le partage émotionnel est maintenant désactivé"
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">Fonctionnalités Premium</h2>
        <p className="text-muted-foreground">
          Découvrez des expériences émotionnelles avancées et personnalisées
        </p>
      </motion.div>

      {/* Emotional Camouflage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 z-0" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Mode caméléon émotionnel
            </CardTitle>
            <CardDescription>
              L'interface s'adapte automatiquement à votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <p>
                Ce mode analyse votre comportement, votre humeur et votre rythme 
                pour adapter automatiquement l'interface. L'application change de 
                thème et d'ambiance sensorielle pour s'aligner avec votre état intérieur.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Activer le mode caméléon</p>
                </div>
                <Switch 
                  checked={preferences.emotionalCamouflage || false}
                  onCheckedChange={handleEmotionalCamouflageChange}
                />
              </div>
              
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="text-sm">
                  Quelques exemples d'adaptation:
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Tons bleus apaisants lors de périodes d'anxiété</li>
                  <li>Transitions douces quand vous êtes calme</li>
                  <li>Interface simplifiée quand vous êtes submergé</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust Circle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20 z-0" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-500" />
              Cercle de confiance
            </CardTitle>
            <CardDescription>
              Partagez votre parcours émotionnel avec des proches
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <p>
                Invitez un ami, un thérapeute ou un partenaire dans votre cercle 
                de confiance pour partager certains aspects de votre parcours émotionnel. 
                Vous gardez le contrôle total sur ce qui est partagé.
              </p>
              
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div>
                  <p className="font-medium">Activer le cercle de confiance</p>
                </div>
                <Switch 
                  checked={preferences.duoModeEnabled || false}
                  onCheckedChange={handleDuoModeChange}
                />
              </div>
              
              <Input 
                placeholder="Email d'un confident de confiance" 
                value={preferences.trustedContact || ''}
                onChange={(e) => updatePreferences({ trustedContact: e.target.value })}
                disabled={!preferences.duoModeEnabled}
                className="mt-2"
              />
              
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="text-sm">
                  Le cercle de confiance permet:
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Partage de résumés émotionnels sélectionnés</li>
                  <li>Échanges de messages d'apaisement</li>
                  <li>Notifications d'alertes (uniquement si activées)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Style Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 z-0" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-amber-500" />
              Assistant stylistique IA
            </CardTitle>
            <CardDescription>
              Créez des ambiances personnalisées pour chaque humeur
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <p>
                Votre assistant IA observe vos préférences et crée des presets d'ambiance
                adaptés à vos différents états émotionnels. Activez-les en un clic quand 
                vous le souhaitez.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button variant="outline" className="bg-background/50">
                  "Mode Nouvelle Lune"
                </Button>
                <Button variant="outline" className="bg-background/50">
                  "Mode Orage intérieur"
                </Button>
                <Button variant="outline" className="bg-background/50">
                  "Mode Sérénité"
                </Button>
                <Button variant="outline" className="bg-background/50">
                  "Mode Créatif"
                </Button>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-md">
                <p className="text-sm">
                  Exemples de suggestions:
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>"Tu sembles apprécier le calme visuel et la musique de piano. Je te propose d'activer le mode 'Refuge intérieur'."</li>
                  <li>"J'ai créé un nouveau thème basé sur tes journaux récents: 'Renouveau printanier'."</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Button className="w-full md:w-auto">
          Activer EmotionsCare Premium
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PremiumFeatures;
