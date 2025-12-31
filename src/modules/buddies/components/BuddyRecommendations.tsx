/**
 * Composant de recommandation de buddies basé sur les intérêts communs
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Heart, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BuddyProfile } from '../types';

interface BuddyRecommendationsProps {
  buddies: BuddyProfile[];
  loading?: boolean;
  onSendRequest: (userId: string) => Promise<boolean>;
  onRefresh?: () => void;
}

export const BuddyRecommendations: React.FC<BuddyRecommendationsProps> = ({
  buddies,
  loading = false,
  onSendRequest,
  onRefresh
}) => {
  const [sendingTo, setSendingTo] = React.useState<string | null>(null);

  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    await onSendRequest(userId);
    setSendingTo(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (buddies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Aucune recommandation disponible
          </p>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              Actualiser
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Recommandés pour vous
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buddies.slice(0, 5).map((buddy, index) => (
          <motion.div
            key={buddy.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.avatar_url || undefined} />
              <AvatarFallback>{buddy.display_name?.charAt(0) || 'B'}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {buddy.display_name || 'Buddy'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="h-3 w-3 text-pink-500" />
                <span>{buddy.support_score || 70}% compatible</span>
              </div>
            </div>

            {buddy.interests.length > 0 && (
              <div className="hidden md:flex gap-1">
                {buddy.interests.slice(0, 2).map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleSendRequest(buddy.user_id)}
              disabled={sendingTo === buddy.user_id}
              className="shrink-0"
            >
              {sendingTo === buddy.user_id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        ))}

        {buddies.length > 5 && (
          <Button variant="ghost" className="w-full" onClick={onRefresh}>
            Voir plus de recommandations
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BuddyRecommendations;
