/**
 * ProtocolSelector - Sélection du protocole de respiration
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BREATHING_PROTOCOLS, BreathingProtocol, getCycleCount } from './BreathingProtocols';

interface ProtocolSelectorProps {
  selectedProtocol: BreathingProtocol | null;
  onSelect: (protocol: BreathingProtocol) => void;
}

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({
  selectedProtocol,
  onSelect,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BREATHING_PROTOCOLS.map((protocol, index) => {
        const isSelected = selectedProtocol?.id === protocol.id;
        const cycleCount = getCycleCount(protocol);

        return (
          <motion.div
            key={protocol.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                'border-2',
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )}
              onClick={() => onSelect(protocol)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{protocol.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{protocol.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDuration(protocol.totalDuration)}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Sélectionné
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-3">
                  {protocol.description}
                </p>

                {/* Phases */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {protocol.phases.map((phase, i) => (
                    <Badge key={i} variant="outline" className="text-xs py-0">
                      {phase.duration}s{' '}
                      {phase.name === 'inhale' && '↑'}
                      {phase.name === 'hold' && '•'}
                      {phase.name === 'exhale' && '↓'}
                      {phase.name === 'holdOut' && '○'}
                    </Badge>
                  ))}
                </div>

                {/* Benefits */}
                <div className="space-y-1">
                  {protocol.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Visual indicator */}
                <div
                  className={cn(
                    'h-1 w-full rounded-full mt-3 bg-gradient-to-r',
                    protocol.color
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProtocolSelector;
