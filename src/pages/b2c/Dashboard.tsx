
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SunMedium, Cloud, CloudRain, Activity, Music, MessageSquare, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground'; 
import { AudioController } from '@/components/home/audio/AudioController';
import { useAmbientSound } from '@/components/home/audio/useAmbientSound';

const QuoteCard = () => {
  // These would typically come from an API in a real implementation
  const quotes = [
    {
      text: "La sérénité commence lorsqu'on cesse d'attendre et qu'on commence à accepter.",
      author: "Lao Tseu"
    },
    {
      text: "Le plus grand voyage commence toujours par un simple pas.",
      author: "Proverbe chinois"
    },
    {
      text: "L'émotion est la source principale de toute prise de conscience.",
      author: "C.G. Jung"
    }
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <Card className="bg-background/50 backdrop-blur-md border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Citation inspirante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic text-muted-foreground">"{randomQuote.text}"</p>
          <p className="text-right text-sm text-muted-foreground mt-2">— {randomQuote.author}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function B2CDashboard() {
  // Mock data for demonstration
  const currentMood = {
    emotion: 'calm',
    intensity: 70,
    icon: <Cloud className="h-10 w-10 text-blue-500" />,
  };

  const { changeSoundByMood } = useAmbientSound({
    autoplay: true,
    volume: 0.2,
    fadeIn: true
  });

  useEffect(() => {
    // Set the music mood based on the user's emotional state
    changeSoundByMood(currentMood.emotion);
  }, [currentMood.emotion, changeSoundByMood]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bonjour';
    if (hour >= 12 && hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <TimeBasedBackground className="overflow-auto">
      <div className="container mx-auto p-6 space-y-8 pb-20">
        <div className="absolute top-4 right-4">
          <AudioController />
        </div>
        
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="text-3xl font-bold">{getGreeting()}</h2>
            <p className="text-muted-foreground">Voici votre météo émotionnelle du jour</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex gap-2">
              <Activity className="h-4 w-4" /> Scan express
            </Button>
            <Button size="sm" variant="outline" className="flex gap-2">
              <MessageSquare className="h-4 w-4" /> Parler à mon coach
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="col-span-1 lg:col-span-2"
            variants={itemVariants}
          >
            <Card className="backdrop-blur-md bg-background/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Votre état émotionnel
                  <span className="text-sm font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">
                    Aujourd'hui
                  </span>
                </CardTitle>
                <CardDescription>Comment vous sentez-vous par rapport aux jours précédents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6 border rounded-xl bg-background/50">
                  <div className="text-center">
                    {currentMood.icon}
                    <h3 className="text-xl font-medium mt-2 capitalize">{currentMood.emotion}</h3>
                    <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentMood.intensity}%` }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Intensité: {currentMood.intensity}%</p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 flex gap-2"
                      onClick={() => {
                        // This would trigger a new emotional scan
                      }}
                    >
                      <RefreshCw className="h-3 w-3" /> Refaire un scan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-md bg-background/30 shadow-xl h-full">
              <CardHeader>
                <CardTitle>Suggestions personnalisées</CardTitle>
                <CardDescription>Pour améliorer votre bien-être</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start hover:bg-muted transition-colors">
                  <Music className="mr-2 h-4 w-4" />
                  Playlist relaxante
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-muted transition-colors">
                  <SunMedium className="mr-2 h-4 w-4" />
                  Exercice de respiration
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-muted transition-colors">
                  <CloudRain className="mr-2 h-4 w-4" />
                  Méditation guidée
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <QuoteCard />

          <motion.div 
            className="col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <Card className="backdrop-blur-md bg-background/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Votre coach personnel
                  <span className="text-sm font-normal px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                    Nouveau message
                  </span>
                </CardTitle>
                <CardDescription>Un conseil adapté à votre journée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-background/50 border">
                  <p className="text-muted-foreground">
                    "Je vois que vous êtes dans un état calme aujourd'hui. C'est parfait pour pratiquer une séance de pleine conscience. 
                    J'ai créé une nouvelle méditation guidée de 10 minutes spécialement pour vous."
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline" className="mr-2">Explorer plus tard</Button>
                    <Button size="sm">Découvrir maintenant</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="col-span-1"
            variants={itemVariants}
          >
            <Card className="backdrop-blur-md bg-background/30 shadow-xl">
              <CardHeader>
                <CardTitle>Votre progression</CardTitle>
                <CardDescription>Évolution émotionnelle sur 7 jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end justify-between">
                  {[65, 55, 70, 60, 75, 65, 70].map((value, index) => (
                    <motion.div 
                      key={index}
                      className="bg-primary/60 rounded-t-md w-[8%]"
                      initial={{ height: 0 }}
                      animate={{ height: `${value}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * index }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mer</span>
                  <span>Jeu</span>
                  <span>Ven</span>
                  <span>Sam</span>
                  <span>Dim</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </TimeBasedBackground>
  );
}
