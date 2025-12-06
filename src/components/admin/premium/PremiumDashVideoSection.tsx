import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, PlayCircle, DownloadCloud, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface PremiumDashVideoSectionProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
  playSound?: () => void;
}

// Mock data for emotional climate keywords
const emotionalKeywords = ['Résilience', 'Collaboration', 'Entraide', 'Équilibre', 'Concentration'];

export const PremiumDashVideoSection: React.FC<PremiumDashVideoSectionProps> = ({
  isActive,
  onClick,
  visualStyle,
  zenMode,
  playSound
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoGenerated, setVideoGenerated] = useState(false);
  
  const handleGenerateVideo = () => {
    if (playSound) playSound();
    setIsGenerating(true);
    
    // Mock video generation process
    setTimeout(() => {
      setIsGenerating(false);
      setVideoGenerated(true);
    }, 3000);
  };

  return (
    <Card 
      className={cn(
        "premium-card overflow-hidden relative transition-all ease-in-out", 
        isActive ? "shadow-xl border-primary/20" : "",
        zenMode ? "bg-background/70 backdrop-blur-lg border-border/50" : ""
      )}
      onClick={onClick}
    >
      <CardHeader className="relative">
        <CardTitle className="flex items-center text-xl">
          <div className="w-10 h-10 mr-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="text-primary" />
          </div>
          Dash vidéo
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Générez une vidéo de visualisation émotionnelle des 30 derniers jours pour les présentations et réunions d'équipe.
          </p>
          
          {!videoGenerated ? (
            <>
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 flex flex-col items-center justify-center">
                <Video className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Visualisation du climat émotionnel sur les 30 derniers jours
                </p>
                <Button 
                  className="mt-4" 
                  onClick={handleGenerateVideo}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="mr-2 h-4 w-4 border-2 border-t-transparent border-primary-foreground rounded-full"
                      />
                      Génération...
                    </>
                  ) : (
                    <>Générer la vidéo</>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <div 
                    className="relative rounded-lg overflow-hidden cursor-pointer border"
                    onClick={() => playSound && playSound()}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="absolute inset-0 bg-card/10 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
                        animate={{ 
                          x: ["0%", "100%"],
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 3,
                          ease: "linear"
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-card/50 backdrop-blur-sm text-foreground">
                      <p className="text-sm font-medium">Climat émotionnel - Mai 2025</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <div className="aspect-video bg-card flex items-center justify-center">
                    <p className="text-foreground">Prévisualisation de la vidéo</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Mots-clés dominants</h3>
                <div className="flex flex-wrap gap-2">
                  {emotionalKeywords.map((keyword, index) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className={cn(
                        "inline-block px-2.5 py-1 text-xs font-medium rounded-full",
                        visualStyle === 'artistic'
                          ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20"
                          : "bg-primary/10 border border-primary/20"
                      )}>
                        {keyword}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {videoGenerated && (
        <CardFooter className="pt-2 flex justify-between">
          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 size={16} />
            <span>Partager</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <DownloadCloud size={16} />
            <span>Télécharger</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
