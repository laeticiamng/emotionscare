
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Radio, 
  Users, 
  Trophy, 
  Calendar, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  CloudSun,
  Settings,
  UserRound
} from "lucide-react";

interface AdminTabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  disabled?: boolean;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({ 
  activeTab, 
  setActiveTab,
  disabled = false
}) => {
  const tabItems = [
    { id: "vue-globale", label: "Vue Globale", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { id: "scan-equipe", label: "Scans Équipe", icon: <Radio className="h-4 w-4 mr-2" /> },
    { id: "social-cocoon", label: "Social Cocoon", icon: <Users className="h-4 w-4 mr-2" /> },
    { id: "gamification", label: "Gamification", icon: <Trophy className="h-4 w-4 mr-2" /> },
    { id: "evenements", label: "Événements", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { id: "journal-trends", label: "Journal", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { id: "actions-rh", label: "Actions RH", icon: <Activity className="h-4 w-4 mr-2" /> },
    { id: "compliance", label: "Conformité", icon: <ShieldCheck className="h-4 w-4 mr-2" /> },
    { id: "weather-activities", label: "Météo & Activités", icon: <CloudSun className="h-4 w-4 mr-2" /> },
    { id: "users-list", label: "Utilisateurs", icon: <UserRound className="h-4 w-4 mr-2" /> },
    { id: "admin-settings", label: "Paramètres", icon: <Settings className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <TabsList className="w-full flex flex-wrap justify-start overflow-x-auto p-0 rounded-md border">
      {tabItems.map(tab => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          onClick={() => setActiveTab(tab.id)}
          disabled={disabled}
          className="flex items-center px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none first:rounded-l-md last:rounded-r-md"
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default AdminTabsNavigation;
