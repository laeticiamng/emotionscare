
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Headphones, Video, Tv2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VRPage: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState('forest');
  const [loading, setLoading] = useState(false);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  
  const experiences = [
    {
      id: 'forest',
      title: 'Forêt sereine',
      description: 'Immersion dans une forêt apaisante avec sons de la nature',
      duration: '15 min',
      icon: <Tv2 className="h-8 w-8" />
    },
    {
      id: 'ocean',
      title: 'Océan calme',
      description: 'Méditation en visualisant les vagues de l\'océan',
      duration: '20 min',
      icon: <Video className="h-8 w-8" />
    },
    {
      id: 'music',
      title: 'Voyage musical',
      description: 'Expérience sonore immersive pour la détente profonde',
      duration: '18 min',
      icon: <Headphones className="h-8 w-8" />
    }
  ];
  
  const startExperience = async () => {
    setLoading(true);
    
    try {
      // Simuler le chargement de l'expérience VR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setActiveExperience(selectedExperience);
      toast.success('Expérience VR lancée');
      
    } catch (error) {
      console.error('Erreur lors du lancement de l\'expérience:', error);
      toast.error('Impossible de lancer l\'expérience VR');
    } finally {
      setLoading(false);
    }
  };
  
  const stopExperience = () => {
    setActiveExperience(null);
    toast.info('Expérience VR terminée');
  };
  
  const currentExperience = experiences.find(exp => exp.id === selectedExperience);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <h1 className="text-3xl font-bold mb-2 text-center">Expériences immersives</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Explorez nos expériences de réalité virtuelle conçues pour améliorer votre bien-être émotionnel
      </p>
      
      {activeExperience ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>En cours : {currentExperience?.title}</CardTitle>
              <CardDescription>
                Laissez-vous guider par cette expérience immersive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 h-64 rounded-md flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {currentExperience?.icon}
                </motion.div>
              </div>
              <div className="mt-4 text-center">
                <p>Expérience en cours... Détendez-vous et immergez-vous dans l'environnement.</p>
                <p className="text-sm text-muted-foreground mt-2">Durée: {currentExperience?.duration}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={stopExperience}
                className="w-full"
              >
                Terminer l'expérience
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Sélectionnez une expérience</CardTitle>
              <CardDescription>
                Choisissez parmi nos environnements immersifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedExperience} 
                onValueChange={setSelectedExperience}
                className="space-y-4"
              >
                {experiences.map(exp => (
                  <div 
                    key={exp.id} 
                    className={`flex items-center space-x-4 p-4 rounded-md border ${
                      selectedExperience === exp.id ? 'border-primary bg-primary/5' : 'border-muted'
                    } cursor-pointer hover:border-primary/50 transition-colors`}
                    onClick={() => setSelectedExperience(exp.id)}
                  >
                    <RadioGroupItem value={exp.id} id={`experience-${exp.id}`} />
                    <div className="bg-primary/10 p-3 rounded-full">
                      {exp.icon}
                    </div>
                    <div className="flex-1">
                      <Label 
                        htmlFor={`experience-${exp.id}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {exp.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Durée: {exp.duration}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={startExperience}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Lancement...
                  </>
                ) : (
                  'Démarrer l\'expérience'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VRPage;
