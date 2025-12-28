/**
 * Exchange Data Export - Export user data in various formats
 */
import React, { useState } from 'react';
import { Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useExchangeProfile, 
  useImprovementGoals, 
  useEmotionPortfolio,
  useTimeExchangeRequests,
  useExchangeStats 
} from '../hooks/useExchangeData';
import { useTrustProfile } from '../hooks/useExchangeData';
import { toast } from 'sonner';

const ExchangeDataExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: profile } = useExchangeProfile();
  const { data: goals } = useImprovementGoals();
  const { data: portfolio } = useEmotionPortfolio();
  const { data: trustProfile } = useTrustProfile();
  const { data: incomingRequests } = useTimeExchangeRequests('incoming');
  const { data: outgoingRequests } = useTimeExchangeRequests('outgoing');
  const { data: stats } = useExchangeStats();

  const gatherData = () => {
    return {
      exportDate: new Date().toISOString(),
      profile: profile ? {
        displayName: profile.display_name,
        level: profile.level,
        totalXp: profile.total_xp,
        badges: profile.badges,
        achievements: profile.achievements,
        ranks: {
          improvement: profile.improvement_rank,
          trust: profile.trust_rank,
          time: profile.time_rank,
          emotion: profile.emotion_rank,
        }
      } : null,
      stats: stats || null,
      trustProfile: trustProfile ? {
        trustScore: trustProfile.trust_score,
        level: trustProfile.level,
        totalGiven: trustProfile.total_given,
        totalReceived: trustProfile.total_received,
        verifiedActions: trustProfile.verified_actions,
        badges: trustProfile.badges,
      } : null,
      improvementGoals: goals?.map(g => ({
        title: g.title,
        type: g.goal_type,
        targetValue: g.target_value,
        currentValue: g.current_value,
        improvementScore: g.improvement_score,
        status: g.status,
        startedAt: g.started_at,
        targetDate: g.target_date,
      })) || [],
      emotionPortfolio: portfolio?.map(p => ({
        assetName: p.asset?.name,
        emotionType: p.asset?.emotion_type,
        quantity: p.quantity,
        acquiredPrice: p.acquired_price,
        currentPrice: p.asset?.current_price,
        acquiredAt: p.acquired_at,
      })) || [],
      timeExchanges: {
        incoming: incomingRequests?.length || 0,
        outgoing: outgoingRequests?.length || 0,
      }
    };
  };

  const exportAsJSON = () => {
    setIsExporting(true);
    try {
      const data = gatherData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `exchange-profile-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export JSON réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = () => {
    setIsExporting(true);
    try {
      const data = gatherData();
      
      // Create CSV content
      const lines = [
        '# PROFIL EXCHANGE',
        `Nom,${data.profile?.displayName || 'N/A'}`,
        `Niveau,${data.profile?.level || 0}`,
        `XP Total,${data.profile?.totalXp || 0}`,
        `Badges,${data.profile?.badges?.join('; ') || 'Aucun'}`,
        '',
        '# STATISTIQUES',
        `Objectifs,${data.stats?.totalGoals || 0}`,
        `Échanges,${data.stats?.totalExchanges || 0}`,
        `Confiance donnée,${data.stats?.trustGiven || 0}`,
        '',
        '# OBJECTIFS D\'AMÉLIORATION',
        'Titre,Type,Progression,Score,Statut',
        ...data.improvementGoals.map(g => 
          `"${g.title}",${g.type},${g.currentValue}/${g.targetValue},${g.improvementScore},${g.status}`
        ),
        '',
        '# PORTFOLIO ÉMOTIONS',
        'Émotion,Type,Quantité,Prix Acquis,Prix Actuel',
        ...data.emotionPortfolio.map(p => 
          `"${p.assetName}",${p.emotionType},${p.quantity},${p.acquiredPrice},${p.currentPrice}`
        ),
      ];

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `exchange-profile-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export CSV réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="ml-2 hidden sm:inline">Exporter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON}>
          <FileJson className="w-4 h-4 mr-2" />
          Format JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV}>
          <FileText className="w-4 h-4 mr-2" />
          Format CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExchangeDataExport;
