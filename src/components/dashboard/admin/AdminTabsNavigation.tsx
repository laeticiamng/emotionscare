
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, Settings, Users, UserPlus } from 'lucide-react';

interface AdminTabsNavigationProps {
  value: string;
  onValueChange: (value: string) => void;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({ value, onValueChange }) => {
  const tabs = [
    {
      value: "users",
      label: "Utilisateurs",
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: "activity-logs",
      label: "Logs d'activité",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      value: "weather-activities",
      label: "Météo & Activités",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      value: "settings",
      label: "Paramètres",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      value: "invitations",
      label: "Invitations",
      icon: <UserPlus className="h-4 w-4" />,
    }
  ];
  
  return (
    <TabsList className="w-full">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} onClick={() => onValueChange(tab.value)} className="h-12">
          {tab.icon}
          <span className="ml-2">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default AdminTabsNavigation;
