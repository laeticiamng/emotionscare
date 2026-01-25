/**
 * Matching Panel - Display compatible users for exchange
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Heart, 
  Clock, 
  Briefcase,
  Zap,
  UserPlus,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useExchangeMatching, useCreateMatch, type MatchCandidate } from '../hooks/useExchangeMatching';
import { toast } from 'sonner';

interface MatchingPanelProps {
  marketType: 'time' | 'trust' | 'improvement' | 'emotion';
}

const factorIcons = {
  emotionalSync: Heart,
  activityOverlap: Zap,
  skillComplement: Briefcase,
  scheduleMatch: Clock,
};

const _factorLabels = {
  emotionalSync: 'Sync émotionnelle',
  activityOverlap: 'Activités similaires',
  skillComplement: 'Compétences',
  scheduleMatch: 'Disponibilités',
};

const MatchCard: React.FC<{ candidate: MatchCandidate; onConnect: () => void; isConnecting: boolean }> = ({ 
  candidate, 
  onConnect,
  isConnecting 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            {candidate.avatarUrl ? (
              <AvatarImage src={candidate.avatarUrl} alt={candidate.displayName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                {candidate.displayName[0]?.toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold truncate">{candidate.displayName}</h4>
              <Badge 
                variant="secondary" 
                className={`shrink-0 ${
                  candidate.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                  candidate.matchScore >= 60 ? 'bg-amber-500/10 text-amber-500' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                {candidate.matchScore}% match
              </Badge>
            </div>

            {/* Match Reasons */}
            {candidate.matchReasons.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {candidate.matchReasons.slice(0, 2).map((reason, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            )}

            {/* Compatibility Factors */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {Object.entries(candidate.compatibilityFactors).slice(0, 4).map(([key, value]) => {
                const Icon = factorIcons[key as keyof typeof factorIcons];
                return (
                  <div key={key} className="flex items-center gap-1">
                    <Icon className="w-3 h-3 text-muted-foreground" />
                    <Progress value={value} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{value}%</span>
                  </div>
                );
              })}
            </div>

            {/* Common Interests */}
            {candidate.commonInterests.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Intérêts: {candidate.commonInterests.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <Button 
          className="w-full mt-3" 
          size="sm"
          onClick={onConnect}
          disabled={isConnecting}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isConnecting ? 'Connexion...' : 'Se connecter'}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

export const MatchingPanel: React.FC<MatchingPanelProps> = ({ marketType }) => {
  const { data: matches, isLoading, error } = useExchangeMatching(marketType);
  const createMatch = useCreateMatch();

  const handleConnect = async (targetUserId: string) => {
    try {
      await createMatch.mutateAsync({ targetUserId, marketType });
      toast.success('Connexion créée ! Vous pouvez maintenant échanger.');
    } catch (err) {
      toast.error('Erreur lors de la connexion');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Correspondances suggérées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !matches || matches.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">Pas de correspondances</h3>
          <p className="text-sm text-muted-foreground">
            Continuez à utiliser la plateforme pour trouver des partenaires d'échange compatibles
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Correspondances suggérées
          </CardTitle>
          <Badge variant="secondary">
            {matches.length} profils
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.slice(0, 5).map((candidate) => (
          <MatchCard
            key={candidate.userId}
            candidate={candidate}
            onConnect={() => handleConnect(candidate.userId)}
            isConnecting={createMatch.isPending}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default MatchingPanel;
