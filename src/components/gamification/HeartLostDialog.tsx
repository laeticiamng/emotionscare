// @ts-nocheck
import { Heart, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useHearts } from '@/hooks/useHearts';
import { motion } from 'framer-motion';

interface HeartLostDialogProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

/**
 * Dialog affiché quand l'utilisateur perd une vie
 */
export const HeartLostDialog = ({ 
  open, 
  onClose,
  reason = "Vous avez échoué au défi" 
}: HeartLostDialogProps) => {
  const { hearts, maxHearts, getTimeUntilNextHeart } = useHearts();

  const formatTime = (ms: number) => {
    const totalMinutes = Math.ceil(ms / (60 * 1000));
    return `${totalMinutes} min`;
  };

  const timeUntilNext = getTimeUntilNextHeart();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4"
          >
            <Heart className="w-16 h-16 text-red-500" />
          </motion.div>
          <DialogTitle className="text-center text-xl">
            Vous avez perdu une vie
          </DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <p className="text-base">{reason}</p>
            
            <div className="flex items-center justify-center gap-2 py-4">
              {Array.from({ length: maxHearts }).map((_, index) => (
                <Heart
                  key={index}
                  className={`w-6 h-6 ${
                    index < hearts
                      ? 'fill-red-500 text-red-500'
                      : 'fill-none text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {hearts > 0 ? (
              <p className="text-sm text-muted-foreground">
                Il vous reste {hearts} {hearts === 1 ? 'vie' : 'vies'}
              </p>
            ) : (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 text-destructive">
                  <Clock className="w-4 h-4" />
                  <p className="font-semibold">Plus de vies !</p>
                </div>
                <p className="text-sm">
                  Prochaine vie dans {formatTime(timeUntilNext)}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 Astuce : Gagnez des vies en :</p>
              <ul className="list-disc list-inside text-left pl-4">
                <li>Complétant des défis quotidiens</li>
                <li>Maintenant une série (streak)</li>
                <li>Débloquant des badges spéciaux</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-2">
          <Button onClick={onClose} variant="default" className="w-full">
            {hearts > 0 ? 'Continuer' : 'Compris'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
