/**
 * Liste des buddies en ligne avec présence temps réel
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Circle, 
  MessageCircle, 
  Users,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OnlineBuddy {
  odaL: string;
  display_name: string;
  avatar_url?: string;
  online_at: string;
  status: 'online' | 'away' | 'busy';
  current_activity?: string;
}

interface OnlineBuddiesListProps {
  buddies: OnlineBuddy[];
  isConnected: boolean;
  onMessageBuddy?: (odaL: string) => void;
}

const STATUS_CONFIG = {
  online: { color: 'bg-green-500', label: 'En ligne' },
  away: { color: 'bg-yellow-500', label: 'Absent' },
  busy: { color: 'bg-red-500', label: 'Occupé' }
};

export const OnlineBuddiesList: React.FC<OnlineBuddiesListProps> = ({
  buddies,
  isConnected,
  onMessageBuddy
}) => {
  if (!isConnected) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connexion...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-5 w-5" />
          Buddies en ligne
          {buddies.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {buddies.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {buddies.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground px-4">
            <Circle className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun buddy en ligne</p>
            <p className="text-xs mt-1">Ils seront notifiés quand vous êtes disponible</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <AnimatePresence>
              {buddies.map((buddy, index) => (
                <motion.div
                  key={buddy.odaL}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={buddy.avatar_url} />
                      <AvatarFallback>
                        {buddy.display_name?.charAt(0) || 'B'}
                      </AvatarFallback>
                    </Avatar>
                    <span 
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
                        STATUS_CONFIG[buddy.status].color
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {buddy.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        STATUS_CONFIG[buddy.status].color
                      )} />
                      {buddy.current_activity || STATUS_CONFIG[buddy.status].label}
                    </p>
                  </div>

                  {onMessageBuddy && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMessageBuddy(buddy.odaL)}
                      className="shrink-0"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineBuddiesList;
