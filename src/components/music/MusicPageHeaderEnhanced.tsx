/**
 * MusicPageHeaderEnhanced - Header enrichi avec tous les contrôles
 * Quota, Immersive, Voice, Raccourcis clavier, Stats
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Music,
  Mic,
  MicOff,
  Maximize,
  Settings,
  Keyboard,
  BarChart3,
  Zap,
  AlertTriangle,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSunoVinyl } from '@/hooks/useSunoVinyl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MusicPageHeaderEnhancedProps {
  hasPreferences?: boolean;
  onOpenPreferences?: () => void;
  onOpenImmersive?: () => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  onOpenStats?: () => void;
}

export const MusicPageHeaderEnhanced: React.FC<MusicPageHeaderEnhancedProps> = ({
  hasPreferences = true,
  onOpenPreferences,
  onOpenImmersive,
  voiceEnabled = false,
  onToggleVoice,
  onOpenStats,
}) => {
  const navigate = useNavigate();
  const { credits } = useSunoVinyl();
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const quotaPercent = credits.total > 0 ? (credits.remaining / credits.total) * 100 : 100;
  const isLowQuota = quotaPercent < 20 && credits.remaining >= 0;
  const isCriticalQuota = quotaPercent < 10 && credits.remaining >= 0;

  // Afficher les raccourcis clavier
  const shortcuts = [
    { key: 'Espace', action: 'Play/Pause' },
    { key: '←', action: 'Piste précédente' },
    { key: '→', action: 'Piste suivante' },
    { key: '↑', action: 'Volume +' },
    { key: '↓', action: 'Volume -' },
    { key: 'M', action: 'Mute/Unmute' },
    { key: 'F', action: 'Mode plein écran' },
    { key: 'L', action: 'Ajouter aux favoris' },
    { key: 'Échap', action: 'Fermer immersif' },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Music className="h-7 w-7 text-primary" />
              Musicothérapie IA
            </h1>
            <p className="text-sm text-muted-foreground">
              Vinyles thérapeutiques générés par Suno AI
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quota Badge */}
          {credits.remaining >= 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={isCriticalQuota ? 'destructive' : isLowQuota ? 'secondary' : 'outline'}
                  className="gap-1 cursor-help"
                >
                  {isCriticalQuota && <AlertTriangle className="h-3 w-3" />}
                  <Zap className="h-3 w-3" />
                  {credits.remaining}/{credits.total}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crédits Suno restants</p>
                {isLowQuota && <p className="text-yellow-500 text-xs">Quota faible!</p>}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Stats Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpenStats}>
                <BarChart3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Statistiques d'écoute</TooltipContent>
          </Tooltip>

          {/* Voice Commands Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={voiceEnabled ? 'default' : 'ghost'}
                size="icon"
                onClick={onToggleVoice}
              >
                {voiceEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {voiceEnabled ? 'Désactiver commandes vocales' : 'Activer commandes vocales'}
            </TooltipContent>
          </Tooltip>

          {/* Immersive Mode Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpenImmersive}>
                <Maximize className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mode immersif</TooltipContent>
          </Tooltip>

          {/* Keyboard Shortcuts Dialog */}
          <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Keyboard className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Raccourcis clavier</TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Raccourcis Clavier
                </DialogTitle>
                <DialogDescription>
                  Contrôlez le lecteur avec votre clavier
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {shortcuts.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">{s.action}</span>
                    <kbd className="px-2 py-1 text-xs bg-background border rounded-md font-mono">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Preferences Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!hasPreferences ? 'default' : 'ghost'}
                size="icon"
                onClick={onOpenPreferences}
              >
                <Settings className="h-5 w-5" />
                {!hasPreferences && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasPreferences ? 'Modifier préférences' : 'Configurer vos goûts'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MusicPageHeaderEnhanced;
