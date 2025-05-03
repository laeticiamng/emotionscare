
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createVRSession } from '@/lib/vrService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

const VRSessionPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inVR, setInVR] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);

  // URL for VR experience (replace with your actual VR content URL)
  const vrUrl = 'https://aframe.io/examples/showcase/helloworld/';

  // Start VR session with timer
  const startVR = () => {
    setInVR(true);
    timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
  };

  // End and save VR session
  const endVR = async () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setInVR(false);
    
    if (user && timer > 0) {
      try {
        await createVRSession(user.id, timer, vrUrl);
        toast({
          title: "Session enregistrée",
          description: `Vous avez fait ${Math.floor(timer/60)}:${(timer%60).toString().padStart(2,'0')} minutes de VR immersive`,
        });
      } catch (error) {
        console.error("Error saving VR session:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre session VR",
          variant: "destructive"
        });
      }
    }
    
    setTimer(0);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-4">🧠 Micro-pause VR</h1>
      
      {/* Benefits banner */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <p className="text-lg font-medium text-blue-800">
            5 minutes de VR = -20% de stress et +15% de concentration
          </p>
          <p className="text-sm mt-1 text-blue-600">
            Les preuves scientifiques montrent que de courtes pauses immersives améliorent votre résilience
          </p>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {!inVR ? (
          <motion.div 
            key="start-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <Button 
              onClick={startVR} 
              size="lg" 
              className="px-10 py-8 text-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all"
            >
              Lancer l'expérience VR
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="vr-experience"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-2 border-blue-300">
              <div className="relative">
                {/* VR Experience */}
                <iframe
                  src={vrUrl}
                  title="VR Experience"
                  className="w-full h-[70vh] md:h-[80vh] border-0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Timer Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}
                  </span>
                </div>
              </div>
              
              <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <p className="text-blue-800 font-medium">
                  Immersion en cours...
                </p>
                <Button 
                  onClick={endVR} 
                  variant="destructive"
                  className="hover:scale-105 transition-transform"
                >
                  Quitter et enregistrer
                </Button>
              </CardFooter>
            </Card>
            
            {/* Accessibility exit button */}
            <div className="fixed bottom-4 right-4 z-50">
              <Button 
                onClick={endVR} 
                variant="outline" 
                size="sm" 
                className="bg-white/90 shadow-md"
              >
                Quitter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRSessionPage;
