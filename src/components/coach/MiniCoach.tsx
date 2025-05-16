
import React, { useState } from 'react';
import CoachCharacter from './CoachCharacter';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Maximize2, Smile } from 'lucide-react';
import CoachChat from './CoachChat';
import { cn } from '@/lib/utils';
import { useCoach } from '@/contexts/CoachContext';

interface MiniCoachProps {
  initialMood?: string;
  initialMessage?: string;
  showByDefault?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const MiniCoach: React.FC<MiniCoachProps> = ({
  initialMood = 'calm',
  initialMessage = "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  showByDefault = false,
  position = 'bottom-right',
  className
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(showByDefault);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hasUnreadMessages } = useCoach();

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  return (
    <>
      {/* Floating coach button */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className={cn(
            "fixed z-50 cursor-pointer",
            positionClasses[position],
            className
          )}>
            <div className="relative">
              <CoachCharacter size="md" mood={initialMood} animate={true} />
              {hasUnreadMessages && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-80 p-0" 
          side="top" 
          align="end" 
          sideOffset={16}
        >
          <div className="flex flex-col h-96 rounded-md overflow-hidden border">
            <div className="bg-muted/50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CoachCharacter size="sm" mood={initialMood} />
                <span className="font-medium">Coach IA</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setIsDialogOpen(true);
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <CoachChat 
                initialMessage={initialMessage}
                showCharacter={false}
                showHeader={false}
                embedded={true}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Full screen dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 h-[80vh]">
          <CoachChat showCharacter={true} showHeader={true} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiniCoach;
