
import React from 'react';
import { 
  BarChart, Calendar, Cloud, 
  FileText, Globe, Settings, 
  Shield, Users, Zap,
  Activity // Add this import for activity logs
} from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminTabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 w-full">
      <TabsTrigger 
        value="vue-globale"
        onClick={() => onTabChange('vue-globale')}
        className="w-full"
        data-state={activeTab === 'vue-globale' ? 'active' : ''}
      >
        <Globe className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Vue globale</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="scan-equipe"
        onClick={() => onTabChange('scan-equipe')}
        className="w-full"
        data-state={activeTab === 'scan-equipe' ? 'active' : ''}
      >
        <BarChart className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Scan équipe</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="social-cocoon"
        onClick={() => onTabChange('social-cocoon')}
        className="w-full"
        data-state={activeTab === 'social-cocoon' ? 'active' : ''}
      >
        <Zap className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Social Cocoon</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="gamification"
        onClick={() => onTabChange('gamification')}
        className="w-full"
        data-state={activeTab === 'gamification' ? 'active' : ''}
      >
        <Zap className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Gamification</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="evenements"
        onClick={() => onTabChange('evenements')}
        className="w-full"
        data-state={activeTab === 'evenements' ? 'active' : ''}
      >
        <Calendar className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Événements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="journal-trends"
        onClick={() => onTabChange('journal-trends')}
        className="w-full"
        data-state={activeTab === 'journal-trends' ? 'active' : ''}
      >
        <FileText className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Journal</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="actions-rh"
        onClick={() => onTabChange('actions-rh')}
        className="w-full"
        data-state={activeTab === 'actions-rh' ? 'active' : ''}
      >
        <FileText className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Actions RH</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="compliance"
        onClick={() => onTabChange('compliance')}
        className="w-full"
        data-state={activeTab === 'compliance' ? 'active' : ''}
      >
        <Shield className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Compliance</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="weather-activities"
        onClick={() => onTabChange('weather-activities')}
        className="w-full"
        data-state={activeTab === 'weather-activities' ? 'active' : ''}
      >
        <Cloud className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Weather</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="users-list"
        onClick={() => onTabChange('users-list')}
        className="w-full"
        data-state={activeTab === 'users-list' ? 'active' : ''}
      >
        <Users className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Utilisateurs</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="activity-logs"
        onClick={() => onTabChange('activity-logs')}
        className="w-full"
        data-state={activeTab === 'activity-logs' ? 'active' : ''}
      >
        <Activity className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Logs d'activité</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="admin-settings"
        onClick={() => onTabChange('admin-settings')}
        className="w-full"
        data-state={activeTab === 'admin-settings' ? 'active' : ''}
      >
        <Settings className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Paramètres</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsNavigation;
