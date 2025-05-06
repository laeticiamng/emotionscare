
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  HeartPulse,
  Hash,
  Trophy,
  Calendar,
  BookHeart,
  HeartHandshake,
  ShieldCheck,
  Cloud,
  Users,
  ActivityIcon,
  Settings,
  Mail
} from 'lucide-react';

interface AdminTabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  disabled: boolean;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({
  activeTab,
  onTabChange,
  disabled
}) => {
  return (
    <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:grid-cols-12">
      <TabsTrigger 
        value="vue-globale"
        onClick={() => onTabChange('vue-globale')}
        disabled={disabled}
        data-state={activeTab === 'vue-globale' ? 'active' : ''}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Vue Globale</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="scan-equipe" 
        onClick={() => onTabChange('scan-equipe')} 
        disabled={disabled}
        data-state={activeTab === 'scan-equipe' ? 'active' : ''}
      >
        <HeartPulse className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Scan Équipe</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="social-cocoon" 
        onClick={() => onTabChange('social-cocoon')} 
        disabled={disabled}
        data-state={activeTab === 'social-cocoon' ? 'active' : ''}
      >
        <Hash className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Social Cocoon</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="gamification" 
        onClick={() => onTabChange('gamification')}
        disabled={disabled}
        data-state={activeTab === 'gamification' ? 'active' : ''}
      >
        <Trophy className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Gamification</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="evenements" 
        onClick={() => onTabChange('evenements')} 
        disabled={disabled}
        data-state={activeTab === 'evenements' ? 'active' : ''}
      >
        <Calendar className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Événements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="journal-trends" 
        onClick={() => onTabChange('journal-trends')}
        disabled={disabled}
        data-state={activeTab === 'journal-trends' ? 'active' : ''}
      >
        <BookHeart className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Journal Trends</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="actions-rh" 
        onClick={() => onTabChange('actions-rh')} 
        disabled={disabled}
        data-state={activeTab === 'actions-rh' ? 'active' : ''}
      >
        <HeartHandshake className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Actions RH</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="compliance" 
        onClick={() => onTabChange('compliance')} 
        disabled={disabled}
        data-state={activeTab === 'compliance' ? 'active' : ''}
      >
        <ShieldCheck className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Compliance</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="weather-activities" 
        onClick={() => onTabChange('weather-activities')}
        disabled={disabled}
        data-state={activeTab === 'weather-activities' ? 'active' : ''}
      >
        <Cloud className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Météo & Activités</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="users-list" 
        onClick={() => onTabChange('users-list')} 
        disabled={disabled}
        data-state={activeTab === 'users-list' ? 'active' : ''}
      >
        <Users className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Utilisateurs</span>
      </TabsTrigger>

      <TabsTrigger 
        value="invitations" 
        onClick={() => onTabChange('invitations')} 
        disabled={disabled}
        data-state={activeTab === 'invitations' ? 'active' : ''}
      >
        <Mail className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Invitations</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="activity-logs" 
        onClick={() => onTabChange('activity-logs')} 
        disabled={disabled}
        data-state={activeTab === 'activity-logs' ? 'active' : ''}
      >
        <ActivityIcon className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Journaux</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="admin-settings" 
        onClick={() => onTabChange('admin-settings')} 
        disabled={disabled}
        data-state={activeTab === 'admin-settings' ? 'active' : ''}
      >
        <Settings className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline-block">Paramètres</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsNavigation;
