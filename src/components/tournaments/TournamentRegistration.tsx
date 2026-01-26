/**
 * TournamentRegistration - Formulaire d'inscription aux tournois
 * TOP 20 #4 - Composant UI pour useTournamentBrackets
 */

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Coins, Clock, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Tournament } from '@/hooks/useTournamentBrackets';

const AVATAR_EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎸', '🎹', '🎺', '🎻', '🎼', '🎵', '🎷', '🥁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '⚔️', '🛡️', '🔥', '⚡', '💎', '🌟'];

interface TournamentRegistrationProps {
  tournament: Tournament;
  isRegistered: boolean;
  isLoading: boolean;
  onRegister: (displayName: string, avatarEmoji: string) => Promise<unknown>;
}

export const TournamentRegistration = memo(({
  tournament,
  isRegistered,
  onRegister
}: TournamentRegistrationProps) => {
  const [displayName, setDisplayName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(AVATAR_EMOJIS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const participationProgress = (tournament.current_participants / tournament.max_participants) * 100;
  const isFull = tournament.current_participants >= tournament.max_participants;
  const startsAt = new Date(tournament.starts_at);
  const hasStarted = startsAt < new Date();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRegister(displayName.trim(), selectedEmoji);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <Card className="border-green-500 bg-green-500/5">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Check className="w-16 h-16 text-green-500 mb-4" />
          </motion.div>
          <h3 className="text-xl font-bold text-green-500 mb-2">Inscription confirmée !</h3>
          <p className="text-muted-foreground text-center">
            Vous êtes inscrit au tournoi <strong>{tournament.name}</strong>
          </p>
          <Badge className="mt-4">
            <Calendar className="w-3 h-3 mr-1" />
            Début: {startsAt.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {tournament.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {tournament.description}
            </CardDescription>
          </div>
          <Badge variant={
            tournament.status === 'registration' ? 'default' :
            tournament.status === 'in_progress' ? 'destructive' : 'secondary'
          }>
            {tournament.status === 'registration' ? 'Inscriptions ouvertes' :
             tournament.status === 'in_progress' ? 'En cours' : tournament.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tournament info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{tournament.current_participants}/{tournament.max_participants} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{startsAt.toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Coins className="w-4 h-4 text-muted-foreground" />
            <span>Frais: {tournament.entry_fee > 0 ? `${tournament.entry_fee} XP` : 'Gratuit'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Prix: {tournament.prize_pool} XP</span>
          </div>
        </div>

        {/* Participation progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Places restantes</span>
            <span className="font-medium">
              {tournament.max_participants - tournament.current_participants}
            </span>
          </div>
          <Progress value={participationProgress} className="h-2" />
        </div>

        {/* Warnings */}
        {isFull && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Ce tournoi est complet. Restez à l'écoute pour les prochains !
            </AlertDescription>
          </Alert>
        )}

        {hasStarted && (
          <Alert>
            <Clock className="w-4 h-4" />
            <AlertDescription>
              Ce tournoi a déjà commencé. Les inscriptions sont fermées.
            </AlertDescription>
          </Alert>
        )}

        {/* Registration form */}
        {!isFull && !hasStarted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nom de joueur</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Entrez votre pseudo..."
                maxLength={20}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Choisissez votre avatar</Label>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`
                      p-2 text-2xl rounded-lg border-2 transition-colors
                      ${selectedEmoji === emoji 
                        ? 'border-primary bg-primary/10' 
                        : 'border-transparent hover:border-muted-foreground/30'}
                    `}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!displayName.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    ⏳
                  </motion.div>
                  Inscription en cours...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  S'inscrire au tournoi
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        <p>
          En vous inscrivant, vous acceptez les règles du tournoi. 
          Les matchs seront notifiés par notification push.
        </p>
      </CardFooter>
    </Card>
  );
});

TournamentRegistration.displayName = 'TournamentRegistration';

export default TournamentRegistration;
