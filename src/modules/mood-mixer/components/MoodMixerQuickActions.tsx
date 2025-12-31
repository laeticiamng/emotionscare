/**
 * Actions rapides pour le Mood Mixer
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shuffle, 
  Wand2, 
  Share2, 
  Download, 
  Timer, 
  Volume2,
  Sparkles,
  Moon,
  Sun,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description?: string;
}

interface MoodMixerQuickActionsProps {
  onRandomize: () => void;
  onOptimize: () => void;
  onShare: () => void;
  onExport: () => void;
  onSetTimer: () => void;
  onToggleAmbient: () => void;
  isAmbientActive?: boolean;
  className?: string;
}

const quickPresets: QuickAction[] = [
  { id: 'relax', label: 'Relaxation', icon: Moon, color: 'from-blue-400 to-indigo-500' },
  { id: 'energy', label: 'Énergie', icon: Zap, color: 'from-orange-400 to-red-500' },
  { id: 'focus', label: 'Focus', icon: Sun, color: 'from-amber-400 to-orange-500' },
];

export const MoodMixerQuickActions: React.FC<MoodMixerQuickActionsProps> = memo(({
  onRandomize,
  onOptimize,
  onShare,
  onExport,
  onSetTimer,
  onToggleAmbient,
  isAmbientActive = false,
  className,
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {quickPresets.map((preset, index) => {
            const IconComponent = preset.icon;
            return (
              <motion.button
                key={preset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  "bg-gradient-to-r text-white text-sm font-medium",
                  "hover:shadow-md transition-shadow",
                  preset.color
                )}
                onClick={onRandomize}
              >
                <IconComponent className="h-4 w-4" />
                {preset.label}
              </motion.button>
            );
          })}
        </div>

        {/* Actions grid */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={onRandomize}
          >
            <Shuffle className="h-4 w-4 text-purple-500" />
            Mix aléatoire
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={onOptimize}
          >
            <Wand2 className="h-4 w-4 text-amber-500" />
            Optimiser
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4 text-blue-500" />
            Partager
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={onExport}
          >
            <Download className="h-4 w-4 text-green-500" />
            Exporter
          </Button>
        </div>

        {/* Timer & Ambient */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={onSetTimer}
          >
            <Timer className="h-4 w-4" />
            Timer
          </Button>
          
          <Button
            variant={isAmbientActive ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
            onClick={onToggleAmbient}
          >
            <Volume2 className="h-4 w-4" />
            Ambiance
            {isAmbientActive && (
              <Badge variant="secondary" className="ml-1 text-xs">On</Badge>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

MoodMixerQuickActions.displayName = 'MoodMixerQuickActions';

export default MoodMixerQuickActions;
