// @ts-nocheck
import { useState, useEffect } from 'react';
import { Sparkle, TrendingUp, TrendingDown, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HarmonyPointsDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  date: Date;
}

const TRANSACTIONS_KEY = 'harmony-points-transactions';

/**
 * Affiche les Points Harmonie (monnaie interne) avec historique
 */
export const HarmonyPointsDisplay = ({ 
  className,
  size = 'md'
}: HarmonyPointsDisplayProps) => {
  const { points, isLoading } = useHarmonyPoints();
  const [animate, setAnimate] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(TRANSACTIONS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.map((t: Transaction) => ({ ...t, date: new Date(t.date) })));
    }
  }, []);

  // Detect point changes and animate
  useEffect(() => {
    if (points && lastPoints !== null && points.totalPoints !== lastPoints) {
      setAnimate(true);
      const diff = points.totalPoints - lastPoints;
      
      // Add transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: diff,
        reason: diff > 0 ? 'Activité complétée' : 'Récompense échangée',
        date: new Date(),
      };
      
      const updatedTransactions = [newTransaction, ...transactions].slice(0, 20);
      setTransactions(updatedTransactions);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
      
      setTimeout(() => setAnimate(false), 600);
    }
    if (points) {
      setLastPoints(points.totalPoints);
    }
  }, [points?.totalPoints]);

  if (isLoading || !points) return null;

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      badge: 'px-2 py-1 text-xs'
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-base',
      badge: 'px-3 py-1.5 text-sm'
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      badge: 'px-4 py-2 text-base'
    }
  };

  const styles = sizeClasses[size];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button className={cn(
                'inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-500/20 cursor-pointer transition-all hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10',
                animate && 'animate-pulse scale-110',
                styles.badge,
                className
              )}>
                <Sparkle className={cn(styles.icon, 'text-purple-500 fill-purple-500', animate && 'animate-spin')} />
                <span className={cn('font-bold tabular-nums', styles.text)}>
                  {points.totalPoints.toLocaleString()}
                </span>
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Cliquez pour voir l'historique</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkle className="h-4 w-4 text-purple-500" />
                Points Harmonie
              </h4>
              <Badge variant="secondary">{points.totalPoints.toLocaleString()}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded-lg bg-green-500/10">
                <p className="text-xs text-muted-foreground">Total gagné</p>
                <p className="font-semibold text-green-600">+{points.lifetimeEarned.toLocaleString()}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <p className="text-xs text-muted-foreground">Total dépensé</p>
                <p className="font-semibold text-red-600">-{points.lifetimeSpent.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Historique récent</span>
              </div>
              
              <ScrollArea className="h-40">
                {transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          {t.amount > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className="text-xs">{t.reason}</span>
                        </div>
                        <div className="text-right">
                          <span className={cn('font-medium', t.amount > 0 ? 'text-green-600' : 'text-red-600')}>
                            {t.amount > 0 ? '+' : ''}{t.amount}
                          </span>
                          <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Aucune transaction récente
                  </p>
                )}
              </ScrollArea>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p className="font-medium mb-1">💡 Utilise tes points pour :</p>
              <ul className="list-disc list-inside pl-2 space-y-0.5">
                <li>Débloquer des thèmes</li>
                <li>Musique premium</li>
                <li>Analyses avancées</li>
                <li>Offrir de l'énergie</li>
              </ul>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
