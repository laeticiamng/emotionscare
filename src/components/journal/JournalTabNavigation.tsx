
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileEdit, Calendar, LineChart } from 'lucide-react';

interface JournalTabNavigationProps {
  viewMode: 'list' | 'calendar' | 'mood';
  onViewChange: (value: 'list' | 'calendar' | 'mood') => void;
  children: React.ReactNode;
}

const JournalTabNavigation: React.FC<JournalTabNavigationProps> = ({ 
  viewMode, 
  onViewChange, 
  children 
}) => {
  return (
    <Tabs value={viewMode} onValueChange={(val) => onViewChange(val as any)} className="mb-8">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="list" className="flex items-center gap-2">
          <FileEdit size={16} /> Liste
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar size={16} /> Calendrier
        </TabsTrigger>
        <TabsTrigger value="mood" className="flex items-center gap-2">
          <LineChart size={16} /> Tendances
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default JournalTabNavigation;
