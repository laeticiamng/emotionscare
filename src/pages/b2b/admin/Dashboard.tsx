import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SegmentProvider } from '@/contexts/SegmentContext';
import AdminPremiumInterface from '@/components/admin/premium/AdminPremiumInterface';
import EmotionalClimateAnalytics from '@/components/admin/premium/EmotionalClimateAnalytics';
import CommunityDashboard from '@/components/admin/premium/CommunityDashboard';
import HumanValueReportSection from '@/components/admin/premium/HumanValueReportSection';
import GamificationInsights from '@/components/admin/premium/GamificationInsights';
import SocialCocoonDashboard from '@/components/admin/premium/SocialCocoonDashboard';
import { fetchTeamAnalytics, TeamAnalytics } from '@/services/teamAnalyticsService';
import { generateHRInsights } from '@/lib/ai/hr-insights-service';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [hrSummary, setHrSummary] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await fetchTeamAnalytics('main-team');
      setAnalytics(data);
      try {
        const insight = await generateHRInsights({ trend: data.emotionalTrend });
        if (insight.success) {
          setHrSummary(insight.summary);
        }
      } catch (e) {
        console.error('HR insights error', e);
      }
    };
    load();
  }, []);

  if (isLoading || !user || !analytics) {
    return <LoadingIllustration />;
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_session');
    localStorage.removeItem('user_role');
    localStorage.removeItem('userMode');
    toast({ title: 'Déconnexion réussie', description: 'À bientôt !' });
    navigate('/');
  };

  return (
    <SegmentProvider>
      <AdminPremiumInterface user={user}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmotionalClimateAnalytics className="order-1" />
          <CommunityDashboard
            isActive={false}
            onClick={() => {}}
            visualStyle="minimal"
            zenMode={false}
            className="order-2"
          />
          <HumanValueReportSection
            isActive={false}
            onClick={() => {}}
            visualStyle="minimal"
            zenMode={false}
            className="order-3"
          />
          <GamificationInsights
            isActive={false}
            onClick={() => {}}
            visualStyle="minimal"
            zenMode={false}
            className="order-4"
          />
          <SocialCocoonDashboard
            isActive={false}
            onClick={() => {}}
            visualStyle="minimal"
            zenMode={false}
            className="order-5"
          />

          <div className="lg:col-span-2 mt-4 text-sm text-muted-foreground">
            {hrSummary}
          </div>
          <div className="lg:col-span-2 mt-4 flex justify-end">
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Se déconnecter
            </button>
          </div>
        </div>
      </AdminPremiumInterface>
    </SegmentProvider>
  );
};

export default B2BAdminDashboard;
