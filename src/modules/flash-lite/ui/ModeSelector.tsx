/**
 * Sélecteur de mode pour flash-lite
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FlashLiteMode } from '../types';
import { FLASH_LITE_MODES } from '../types';

interface ModeSelectorProps {
  selected: FlashLiteMode;
  onSelect: (mode: FlashLiteMode) => void;
}

export const ModeSelector = ({ selected, onSelect }: ModeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(Object.keys(FLASH_LITE_MODES) as FlashLiteMode[]).map((mode) => {
        const info = FLASH_LITE_MODES[mode];
        const isSelected = selected === mode;

        return (
          <Card
            key={mode}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(mode)}
          >
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{info.icon}</span>
                  <h3 className="text-lg font-semibold">{info.name}</h3>
                </div>
                {isSelected && (
                  <Badge variant="default">
                    Sélectionné
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {info.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
