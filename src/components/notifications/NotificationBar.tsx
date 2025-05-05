
import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

interface NotificationBarProps {
  userId?: string;
  unreadCount?: number;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ 
  userId,
  unreadCount = 0
}) => {
  const [isSilenced, setIsSilenced] = useState(false);
  const { toast } = useToast();

  // Load silence preference from localStorage
  useEffect(() => {
    const silencePreference = localStorage.getItem('notification_silence');
    if (silencePreference) {
      setIsSilenced(silencePreference === 'true');
    }
  }, []);

  const toggleSilenceMode = () => {
    const newSilenceState = !isSilenced;
    setIsSilenced(newSilenceState);
    localStorage.setItem('notification_silence', String(newSilenceState));
    
    toast({
      title: newSilenceState ? "Mode Silence activé" : "Mode Silence désactivé",
      description: newSilenceState 
        ? "Vous recevrez uniquement un résumé hebdomadaire" 
        : "Vous recevrez toutes les notifications",
      duration: 3000
    });
  };

  return (
    <div className="flex items-center space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={toggleSilenceMode}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={isSilenced ? "Activer les notifications" : "Activer le mode silence"}
            >
              {isSilenced ? (
                <BellOff className="h-5 w-5" />
              ) : (
                <>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isSilenced 
              ? "Activer les notifications" 
              : "Activer le mode silence (résumé hebdomadaire uniquement)"
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NotificationBar;
