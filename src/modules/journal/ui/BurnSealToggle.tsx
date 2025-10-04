/**
 * BurnSealToggle - Toggle pour marquer une entrée comme éphémère
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Archive, 
  Clock, 
  Lock,
  AlertTriangle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BurnSealToggleProps {
  isEphemeral: boolean;
  onToggle: (ephemeral: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const BurnSealToggle: React.FC<BurnSealToggleProps> = ({
  isEphemeral,
  onToggle,
  disabled = false,
  className
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<'burn' | 'seal' | null>(null);

  const handleToggle = (action: 'burn' | 'seal') => {
    if (disabled) return;
    
    setPendingAction(action);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (pendingAction) {
      onToggle(pendingAction === 'burn');
      setShowConfirmation(false);
      setPendingAction(null);
    }
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const getBurnConfig = () => ({
    icon: Flame,
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    activeClass: 'bg-orange-500 text-white hover:bg-orange-600',
    label: 'À brûler',
    description: 'Cette entrée sera supprimée dans 24h'
  });

  const getSealConfig = () => ({
    icon: Archive,
    color: 'text-blue-600', 
    bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    activeClass: 'bg-blue-500 text-white hover:bg-blue-600',
    label: 'Garder',
    description: 'Cette entrée sera conservée de façon permanente'
  });

  const burnConfig = getBurnConfig();
  const sealConfig = getSealConfig();
  const BurnIcon = burnConfig.icon;
  const SealIcon = sealConfig.icon;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle principal */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Confidentialité</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Option Brûler */}
              <Button
                variant={isEphemeral ? "default" : "outline"}
                onClick={() => handleToggle('burn')}
                disabled={disabled}
                className={cn(
                  "h-auto p-4 flex-col gap-2",
                  isEphemeral ? burnConfig.activeClass : burnConfig.bg
                )}
              >
                <BurnIcon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{burnConfig.label}</div>
                  <div className="text-xs opacity-80">24h puis supprimé</div>
                </div>
              </Button>

              {/* Option Garder */}
              <Button
                variant={!isEphemeral ? "default" : "outline"}
                onClick={() => handleToggle('seal')}
                disabled={disabled}
                className={cn(
                  "h-auto p-4 flex-col gap-2",
                  !isEphemeral ? sealConfig.activeClass : sealConfig.bg
                )}
              >
                <SealIcon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{sealConfig.label}</div>
                  <div className="text-xs opacity-80">Conservé</div>
                </div>
              </Button>
            </div>

            {/* Status actuel */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t">
              {isEphemeral ? (
                <>
                  <Clock className="h-4 w-4 text-orange-500" />
                  <Badge variant="destructive" className="gap-1">
                    <Flame className="h-3 w-3" />
                    Éphémère (24h)
                  </Badge>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 text-blue-500" />
                  <Badge variant="default" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Conservé
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      Confirmer l'action
                    </span>
                  </div>

                  <p className="text-sm text-orange-700">
                    {pendingAction === 'burn' 
                      ? "Cette entrée sera automatiquement supprimée dans 24 heures. Êtes-vous sûr ?"
                      : "Cette entrée sera conservée de façon permanente. Confirmer ?"
                    }
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={confirmAction}
                      className="flex-1 gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelAction}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BurnSealToggle;