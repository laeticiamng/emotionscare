
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, MessageSquare, Trophy, Sparkles, 
  ShieldCheck, CalendarDays, Settings, Activity, LineChart 
} from 'lucide-react';

interface AdminTabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  disabled?: boolean;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({ activeTab, setActiveTab, disabled }) => {
  return (
    <TabsList className="mb-4 bg-white/50 backdrop-blur-sm">
      <TabsTrigger value="vue-globale" onClick={() => setActiveTab("vue-globale")} disabled={disabled}>
        <BarChart2 className="mr-2 h-4 w-4" />
        Vue Globale
      </TabsTrigger>
      <TabsTrigger value="scan-team" onClick={() => setActiveTab("scan-team")} disabled={disabled}>
        <Activity className="mr-2 h-4 w-4" />
        Scan Émotionnel
      </TabsTrigger>
      <TabsTrigger value="journal-trends" onClick={() => setActiveTab("journal-trends")} disabled={disabled}>
        <LineChart className="mr-2 h-4 w-4" />
        Journal
      </TabsTrigger>
      <TabsTrigger value="social-cocoon" onClick={() => setActiveTab("social-cocoon")} disabled={disabled}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Social Cocoon
      </TabsTrigger>
      <TabsTrigger value="gamification" onClick={() => setActiveTab("gamification")} disabled={disabled}>
        <Trophy className="mr-2 h-4 w-4" />
        Gamification
      </TabsTrigger>
      <TabsTrigger value="actions-rh" onClick={() => setActiveTab("actions-rh")} disabled={disabled}>
        <Sparkles className="mr-2 h-4 w-4" />
        Actions RH
      </TabsTrigger>
      <TabsTrigger value="events" onClick={() => setActiveTab("events")} disabled={disabled}>
        <CalendarDays className="mr-2 h-4 w-4" />
        Événements
      </TabsTrigger>
      <TabsTrigger value="compliance" onClick={() => setActiveTab("compliance")} disabled={disabled}>
        <ShieldCheck className="mr-2 h-4 w-4" />
        Conformité
      </TabsTrigger>
      <TabsTrigger value="settings" onClick={() => setActiveTab("settings")} disabled={disabled}>
        <Settings className="mr-2 h-4 w-4" />
        Paramètres
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsNavigation;
