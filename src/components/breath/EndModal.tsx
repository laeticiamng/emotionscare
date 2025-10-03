import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from '@/hooks/router';

interface EndModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeId?: string;
}

export const EndModal: React.FC<EndModalProps> = ({
  isOpen,
  onClose,
  badgeId
}) => {
  const router = useRouter();

  const handleContinue = (module: string) => {
    onClose();
    router.push(`/${module}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          
          <DialogTitle className="text-xl">
            Bien joué ✨
          </DialogTitle>
          
          <DialogDescription className="text-base">
            Tu as terminé ta session de breathwork avec succès !
          </DialogDescription>
        </DialogHeader>

        {/* Badge earned */}
        {badgeId && (
          <div className="text-center py-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Award className="w-4 h-4 mr-1" />
              Badge débloqué : {badgeId}
            </Badge>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Continue ton parcours bien-être :
          </p>

          <div className="grid gap-2">
            <Button
              variant="outline"
              className="justify-between h-12"
              onClick={() => handleContinue('flash-glow')}
            >
              <div className="text-left">
                <div className="font-medium">Flash Glow</div>
                <div className="text-xs text-muted-foreground">
                  Relaxation express 60s
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline" 
              className="justify-between h-12"
              onClick={() => handleContinue('music')}
            >
              <div className="text-left">
                <div className="font-medium">Musicothérapie</div>
                <div className="text-xs text-muted-foreground">
                  Session musicale adaptée
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              className="justify-between h-12" 
              onClick={() => handleContinue('screen-silk')}
            >
              <div className="text-left">
                <div className="font-medium">Screen-Silk</div>
                <div className="text-xs text-muted-foreground">
                  Micro-break immersif
                </div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full"
          >
            Terminer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};