/**
 * Demandes de buddy reçues
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, UserPlus, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { BuddyRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BuddyRequestsProps {
  requests: BuddyRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export const BuddyRequests: React.FC<BuddyRequestsProps> = ({
  requests,
  onAccept,
  onDecline
}) => {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">Aucune demande en attente</p>
          <p className="text-xs text-muted-foreground mt-1">
            Les demandes de connexion apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          {requests.length} demande{requests.length > 1 ? 's' : ''} en attente
        </Badge>
      </div>

      <AnimatePresence>
        {requests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={request.from_profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10">
                      {request.from_profile?.display_name?.charAt(0) || 'B'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {request.from_profile?.display_name || 'Buddy'}
                      </h3>
                      {request.compatibility_score && (
                        <Badge variant="outline" className="gap-1 shrink-0">
                          <Heart className="h-3 w-3 text-pink-500" />
                          {request.compatibility_score}%
                        </Badge>
                      )}
                    </div>

                    {request.from_profile?.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {request.from_profile.bio}
                      </p>
                    )}

                    {request.message && (
                      <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                        <p className="text-sm italic">"{request.message}"</p>
                      </div>
                    )}

                    {request.from_profile?.interests && request.from_profile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {request.from_profile.interests.slice(0, 3).map((interest, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      Reçue {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => onAccept(request.id)}
                    >
                      <Check className="h-4 w-4" />
                      Accepter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onDecline(request.id)}
                    >
                      <X className="h-4 w-4" />
                      Refuser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BuddyRequests;
