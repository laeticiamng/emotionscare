/**
 * ParkQuickActions - Actions rapides pour le parc
 */

import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  Download, 
  Settings, 
  Map, 
  Target, 
  Trophy,
  Shuffle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ParkQuickActionsProps {
  onShowFavorites?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onShowMap?: () => void;
  onRandomAttraction?: () => void;
  onDailyChallenge?: () => void;
  onAchievements?: () => void;
  className?: string;
}

export function ParkQuickActions({
  onShowFavorites,
  onShare,
  onExport,
  onSettings,
  onShowMap,
  onRandomAttraction,
  onDailyChallenge,
  onAchievements,
  className = ''
}: ParkQuickActionsProps) {
  const actions = [
    { icon: Heart, label: 'Favoris', onClick: onShowFavorites, color: 'text-red-500' },
    { icon: Share2, label: 'Partager', onClick: onShare, color: 'text-blue-500' },
    { icon: Download, label: 'Exporter', onClick: onExport, color: 'text-green-500' },
    { icon: Map, label: 'Carte', onClick: onShowMap, color: 'text-purple-500' },
    { icon: Shuffle, label: 'Surprise', onClick: onRandomAttraction, color: 'text-orange-500' },
    { icon: Target, label: 'Défi', onClick: onDailyChallenge, color: 'text-pink-500' },
    { icon: Trophy, label: 'Succès', onClick: onAchievements, color: 'text-yellow-500' },
    { icon: Settings, label: 'Réglages', onClick: onSettings, color: 'text-gray-500' },
  ].filter(action => action.onClick);

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 flex-wrap ${className}`}>
        {actions.map((action, index) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className={`h-8 w-8 p-0 hover:bg-accent ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export default ParkQuickActions;
