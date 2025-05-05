
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import KpiCards from '@/components/dashboard/KpiCards';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import CoachRecommendations from '@/components/dashboard/CoachRecommendations';
import { Separator } from '@/components/ui/separator';
import UserModulesGrid from '@/components/dashboard/UserModulesGrid';
import EmotionScanCard from '@/components/dashboard/EmotionScanCard';
import SocialCocoonWidget from '@/components/dashboard/SocialCocoonWidget';
import GamificationWidget from '@/components/dashboard/GamificationWidget';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-4xl font-light">Bienvenue, <span className="font-semibold">{user?.name || 'utilisateur'}</span></h1>
            <h2 className="text-xl text-muted-foreground mt-2">
              Votre espace bien-être personnel
            </h2>
          </div>
        </div>
      </div>
      
      <Separator className="mb-8" />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <EmotionScanCard className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }} />
          <SocialCocoonWidget className="animate-slide-up" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <div className="flex flex-col">
          <CoachAssistant className="mb-6 animate-slide-up glass-card" style={{ animationDelay: '0.3s' }} />
          <GamificationWidget className="animate-slide-up glass-card" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-2xl font-semibold mb-4">Navigation rapide</h3>
        <UserModulesGrid />
      </div>
      
      <div className="mt-12 py-6 border-t text-center text-sm text-muted-foreground">
        <p>Données chiffrées AES-256, authentification Supabase Auth, permissions RBAC strictes, conformité GDPR</p>
      </div>
    </div>
  );
};

export default UserDashboard;
