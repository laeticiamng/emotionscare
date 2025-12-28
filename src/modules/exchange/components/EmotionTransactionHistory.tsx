/**
 * Emotion Transaction History - Display emotion trading history
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Play,
  Gift,
  History,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmotionTransactionHistory } from '../hooks/useExchangeData';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const transactionIcons = {
  buy: ArrowDownRight,
  sell: ArrowUpRight,
  use: Play,
  gift: Gift,
};

const transactionColors = {
  buy: 'text-emerald-500 bg-emerald-500/10',
  sell: 'text-rose-500 bg-rose-500/10',
  use: 'text-blue-500 bg-blue-500/10',
  gift: 'text-purple-500 bg-purple-500/10',
};

const transactionLabels = {
  buy: 'Achat',
  sell: 'Vente',
  use: 'Utilisé',
  gift: 'Don',
};

interface EmotionTransactionHistoryProps {
  compact?: boolean;
}

const EmotionTransactionHistory: React.FC<EmotionTransactionHistoryProps> = ({ compact = false }) => {
  const { data: transactions, isLoading } = useEmotionTransactionHistory();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <History className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">
            Aucune transaction d'émotion
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedTransactions = compact ? transactions.slice(0, 5) : transactions;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4 text-pink-500" />
          Historique des transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={compact ? 'h-48' : 'h-80'}>
          <div className="space-y-2">
            {displayedTransactions.map((tx: any, index: number) => {
              const type = tx.transaction_type as keyof typeof transactionIcons;
              const Icon = transactionIcons[type] || History;
              const colorClass = transactionColors[type] || 'text-muted-foreground bg-muted';
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {tx.asset?.name || 'Émotion'}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {tx.asset?.emotion_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {transactionLabels[type]} · {tx.quantity}x
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className={`font-semibold ${
                      type === 'buy' ? 'text-emerald-500' : 
                      type === 'sell' ? 'text-rose-500' : 
                      'text-muted-foreground'
                    }`}>
                      {type === 'buy' ? '-' : type === 'sell' ? '+' : ''}
                      {tx.total_price > 0 ? tx.total_price.toFixed(1) : '0'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.created_at), { 
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

export default EmotionTransactionHistory;
