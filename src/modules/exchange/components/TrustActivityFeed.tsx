/**
 * Trust Activity Feed - Recent trust transactions and activities
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const transactionTypeConfig = {
  give: { icon: Heart, color: 'text-rose-500 bg-rose-500/10', label: 'Donné' },
  receive: { icon: Star, color: 'text-amber-500 bg-amber-500/10', label: 'Reçu' },
  earn: { icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10', label: 'Gagné' },
  stake: { icon: Shield, color: 'text-blue-500 bg-blue-500/10', label: 'Staké' },
};

const TrustActivityFeed: React.FC = () => {
  const { user } = useAuth();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['trust-activities', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_transactions')
        .select(`
          *,
          project:trust_projects(title)
        `)
        .or(`from_user_id.eq.${user?.id},to_user_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            Aucune activité récente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="w-4 h-4 text-blue-500" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activities.map((activity: any, index: number) => {
              const type = activity.transaction_type as keyof typeof transactionTypeConfig;
              const config = transactionTypeConfig[type] || transactionTypeConfig.give;
              const Icon = config.icon;
              const isOutgoing = activity.from_user_id === user?.id;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {isOutgoing ? 'Vous avez donné' : 'Vous avez reçu'} {activity.amount} pts
                    </p>
                    {activity.project?.title && (
                      <p className="text-xs text-muted-foreground truncate">
                        Projet: {activity.project.title}
                      </p>
                    )}
                    {activity.reason && (
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.reason}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${activity.verified ? 'border-emerald-500/50' : ''}`}
                    >
                      {activity.verified ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Vérifié</>
                      ) : (
                        config.label
                      )}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrustActivityFeed;
