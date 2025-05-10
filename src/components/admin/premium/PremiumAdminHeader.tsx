import React from 'react';
import { 
  Bell, 
  Moon, 
  Volume2, 
  VolumeX, 
  Settings, 
  Download, 
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  LayoutPanelTop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { SegmentSelector } from '@/components/dashboard/admin/SegmentSelector';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/user';

interface PremiumAdminHeaderProps {
  user: User | null;
  zenMode: boolean;
  onZenModeToggle: () => void;
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
  visualStyle: 'minimal' | 'artistic';
  onVisualStyleToggle: () => void;
  onPresentationMode: () => void;
  playSound?: () => void;
}

export const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({
  user,
  zenMode,
  onZenModeToggle,
  isSoundEnabled,
  onSoundToggle,
  visualStyle,
  onVisualStyleToggle,
  onPresentationMode,
  playSound
}) => {
  const handleButtonClick = (callback: () => void) => {
    if (playSound) playSound();
    callback();
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`px-6 py-4 border-b ${
        zenMode 
          ? 'bg-background/40 backdrop-blur-lg'
          : 'bg-background'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-light tracking-tight">
              <span className="font-semibold">EmotionsCare</span> Administration
            </h1>
            <Badge variant="outline" className="ml-2">Premium</Badge>
          </div>
          <p className="text-muted-foreground mt-0.5">
            Console de pilotage émotionnel – {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <TooltipProvider>
            {/* Segment Selector */}
            <div className="mr-2">
              <SegmentSelector />
            </div>
            
            {/* Zen Mode Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleButtonClick(onZenModeToggle)}
                  className={`transition-all ${zenMode ? 'bg-primary/10' : ''}`}
                >
                  {zenMode ? <PanelLeftOpen /> : <PanelLeftClose />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{zenMode ? 'Désactiver' : 'Activer'} le mode zen</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Sound Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleButtonClick(onSoundToggle)}
                  className={`transition-all ${isSoundEnabled ? 'bg-primary/10' : ''}`}
                >
                  {isSoundEnabled ? <Volume2 /> : <VolumeX />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSoundEnabled ? 'Désactiver' : 'Activer'} le son</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Visual Style Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleButtonClick(onVisualStyleToggle)}
                  className={`transition-all ${visualStyle === 'artistic' ? 'bg-primary/10' : ''}`}
                >
                  <Palette />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Style {visualStyle === 'artistic' ? 'minimal' : 'artistique'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Presentation Mode Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleButtonClick(onPresentationMode)}
                >
                  <LayoutPanelTop />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mode présentation</p>
              </TooltipContent>
            </Tooltip>
            
            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" onClick={playSound}>
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={playSound}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Exporter les données</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={playSound}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Gérer les alertes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={playSound}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Préférences d'affichage</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </motion.header>
  );
};
