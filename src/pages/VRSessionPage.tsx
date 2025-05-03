
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createVRSession } from '@/lib/vrService';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const VRSessionPage: React.FC = () => {
  const { user } = useAuth();
  const [inVR, setInVR] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // URL exemple (CoSpaces embed ou autre)
  const vrUrl = 'https://embed.cospaces.io/BWMNJf';

  // Démarre la session VR
  const startVR = () => {
    setInVR(true);
    timerRef.current = window.setInterval(() => setTimer(t => t + 1), 1000);
  };

  // Arrête et enregistre la session
  const endVR = async () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    try {
      if (user) {
        await createVRSession(user.id, timer, vrUrl);
        toast({
          title: "Session VR terminée",
          description: `Session de ${Math.floor(timer/60)}:${(timer%60).toString().padStart(2,'0')} enregistrée avec succès!`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la session VR",
        variant: "destructive"
      });
      console.error(error);
    }
    
    setInVR(false);
    setTimer(0);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Micro-pause VR immersive</h1>
      
      {!inVR ? (
        <div className="text-center">
          <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">5 minutes de VR = 20% de réduction du stress</h2>
              <p className="text-muted-foreground">
                Les pauses immersives sont scientifiquement prouvées pour améliorer le bien-être et réduire le stress professionnel.
              </p>
            </CardContent>
          </Card>
          
          <Button 
            onClick={startVR} 
            size="lg" 
            className="px-8 py-6 text-lg animate-pulse"
          >
            Lancer ma pause immersive
          </Button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.3 }}
        >
          <Card className="relative p-0 overflow-hidden">
            <div className="bg-indigo-600 text-white p-3 text-center font-medium">
              5 min de VR = -20 % de stress • Respirez profondément et détendez-vous
            </div>
            
            <iframe
              src={vrUrl}
              title="VR Immersive"
              className="w-full h-[70vh] md:h-[60vh] border-0"
            />
            
            <div className="p-4 bg-white rounded-b-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xl font-mono">
                ⏱️ Durée : {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}
              </div>
              
              <Button 
                onClick={endVR} 
                variant="destructive"
                size="lg"
                className="w-full sm:w-auto"
              >
                Quitter et enregistrer
              </Button>
            </div>
            
            {/* Accessible exit button overlay */}
            <Button
              onClick={endVR}
              variant="secondary"
              className="absolute top-2 right-2 z-50 bg-white/80 hover:bg-white"
              size="sm"
            >
              Quitter
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VRSessionPage;
