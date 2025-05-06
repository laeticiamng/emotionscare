
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSegment } from '@/contexts/SegmentContext';
import { useToast } from '@/hooks/use-toast';

export const SegmentSelector: React.FC = () => {
  const { segment, setSegment, dimensions, isLoading, activeDimension, activeOption } = useSegment();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (dimensionKey: string, optionKey: string) => {
    setSegment({
      dimensionKey,
      optionKey
    });
    setIsOpen(false);
    
    toast({
      title: "Segment mis à jour",
      description: `Les données sont maintenant filtrées par ce segment.`,
      duration: 3000,
    });
  };

  const handleClearFilter = () => {
    setSegment({
      dimensionKey: null,
      optionKey: null
    });
    setIsOpen(false);
    
    toast({
      title: "Filtre réinitialisé",
      description: "Toutes les données sont maintenant affichées sans filtrage.",
      duration: 3000,
    });
  };

  // Create the button label based on selection
  const buttonLabel = activeOption 
    ? `${activeDimension?.label}: ${activeOption.label}` 
    : "Segment";

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-9 px-3 flex items-center gap-2 w-48 justify-between ${
              activeOption ? 'border-primary text-primary' : ''
            }`}
          >
            <span className="truncate">{buttonLabel}</span>
            <Filter className="h-4 w-4 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filtrer par segment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {dimensions.map((dimension) => (
            <DropdownMenuSub key={dimension.key}>
              <DropdownMenuSubTrigger>
                <span>{dimension.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {dimension.options.map((option) => (
                    <DropdownMenuItem 
                      key={option.key}
                      className={
                        segment.dimensionKey === dimension.key && 
                        segment.optionKey === option.key ? 
                        "bg-primary/10" : ""
                      }
                      onClick={() => handleSelectOption(dimension.key, option.key)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
          
          {activeOption && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleClearFilter}
              >
                Effacer le filtre
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
