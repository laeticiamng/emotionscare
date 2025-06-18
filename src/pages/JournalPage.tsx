
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';

const JournalPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Journal Personnel</h1>
      <JournalTabNavigation />
    </div>
  );
};

export default JournalPage;
