/**
 * WeekGrid - Grille de visualisation hebdomadaire des blocs temporels
 */
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimeBlock, TimeBlockType } from '@/hooks/timecraft';

interface WeekGridProps {
  blocks: TimeBlock[];
  blocksByDay: Record<number, TimeBlock[]>;
  onAddBlock?: (day: number, hour: number) => void;
  onEditBlock?: (block: TimeBlock) => void;
  onDeleteBlock?: (id: string) => void;
  viewMode?: 'week' | 'month';
}

const daysOfWeek = [
  { value: 1, label: 'Lun', fullLabel: 'Lundi' },
  { value: 2, label: 'Mar', fullLabel: 'Mardi' },
  { value: 3, label: 'Mer', fullLabel: 'Mercredi' },
  { value: 4, label: 'Jeu', fullLabel: 'Jeudi' },
  { value: 5, label: 'Ven', fullLabel: 'Vendredi' },
  { value: 6, label: 'Sam', fullLabel: 'Samedi' },
  { value: 0, label: 'Dim', fullLabel: 'Dimanche' },
];

const blockTypeColors: Record<TimeBlockType, string> = {
  creation: 'bg-purple-500/30 border-purple-500/50',
  recovery: 'bg-blue-500/30 border-blue-500/50',
  constraint: 'bg-orange-500/30 border-orange-500/50',
  emotional: 'bg-red-500/30 border-red-500/50',
  chosen: 'bg-green-500/30 border-green-500/50',
  imposed: 'bg-gray-500/30 border-gray-500/50',
};

export const WeekGrid = memo(function WeekGrid({
  blocksByDay,
  onAddBlock,
  onEditBlock,
}: WeekGridProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);

  // Hours to display (6h to 23h)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const getBlocksForSlot = (day: number, hour: number) => {
    const dayBlocks = blocksByDay[day] || [];
    return dayBlocks.filter(
      block => hour >= block.start_hour && hour < block.start_hour + block.duration_hours
    );
  };

  const isBlockStart = (block: TimeBlock, hour: number) => {
    return block.start_hour === hour;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Vue semaine</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Cliquez sur une case pour ajouter un bloc temporel
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header - Days */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b bg-muted/30">
              <div className="p-2 text-xs text-muted-foreground text-center border-r">
                Heure
              </div>
              {daysOfWeek.map((day) => (
                <div
                  key={day.value}
                  className="p-2 text-center border-r last:border-r-0"
                >
                  <div className="font-medium text-sm">{day.label}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {day.fullLabel}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="divide-y">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[60px_repeat(7,1fr)]"
                >
                  {/* Hour label */}
                  <div className="p-2 text-xs text-muted-foreground text-center border-r flex items-center justify-center">
                    {hour}h
                  </div>

                  {/* Day cells */}
                  {daysOfWeek.map((day) => {
                    const cellBlocks = getBlocksForSlot(day.value, hour);
                    const isHovered = hoveredCell?.day === day.value && hoveredCell?.hour === hour;
                    const hasBlocks = cellBlocks.length > 0;

                    return (
                      <div
                        key={`${day.value}-${hour}`}
                        className={cn(
                          'relative min-h-[48px] p-1 border-r last:border-r-0 transition-colors',
                          isHovered && !hasBlocks && 'bg-primary/5',
                          hasBlocks && 'p-0'
                        )}
                        onMouseEnter={() => setHoveredCell({ day: day.value, hour })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => !hasBlocks && onAddBlock?.(day.value, hour)}
                      >
                        <AnimatePresence mode="wait">
                          {cellBlocks.length > 0 ? (
                            cellBlocks.map((block) => {
                              if (!isBlockStart(block, hour)) return null;
                              
                              return (
                                <motion.div
                                  key={block.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className={cn(
                                    'absolute inset-1 rounded-md border-2 cursor-pointer transition-all hover:shadow-md',
                                    blockTypeColors[block.block_type]
                                  )}
                                  style={{
                                    height: `${block.duration_hours * 48 - 8}px`,
                                    zIndex: 10,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditBlock?.(block);
                                  }}
                                >
                                  <div className="p-1.5 h-full overflow-hidden">
                                    <p className="text-xs font-medium truncate">
                                      {block.label || block.block_type}
                                    </p>
                                    {block.duration_hours > 1 && (
                                      <p className="text-[10px] text-muted-foreground">
                                        {block.duration_hours}h
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })
                          ) : (
                            isHovered && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                              >
                                <Plus className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            )
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default WeekGrid;
