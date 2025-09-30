// @ts-nocheck
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSegment } from '@/contexts/SegmentContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const SegmentSelector: React.FC = () => {
  const { 
    segment = 'all',
    setSegment,
    dimensions = [],
    isLoading,
    activeDimension,
    activeOption
  } = useSegment();

  const handleDimensionSelect = (dimension: string) => {
    if (!setSegment) return;
    setSegment(dimension);
  };

  const handleClearFilter = () => {
    if (!setSegment) return;
    setSegment(null);
  };

  if (isLoading) {
    return <div>Chargement des segments...</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Filtrer par:</span>
        
        {dimensions.map((dimension) => (
          <Select 
            key={dimension.key} 
            value={activeDimension === dimension.key ? activeOption : undefined}
            onValueChange={(value) => handleDimensionSelect(value)}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder={dimension.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{dimension.label}</SelectLabel>
                {dimension.options.map((option) => (
                  <SelectItem 
                    key={option.key} 
                    value={option.key}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ))}
      </div>
      
      {segment && segment !== 'all' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs" 
          onClick={handleClearFilter}
        >
          Effacer les filtres
          <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default SegmentSelector;
