
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import EnhancedCoachChat from '@/components/coach/EnhancedCoachChat';

const CoachChatPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 h-[calc(100vh-12rem)]">
        <h1 className="text-3xl font-bold mb-6">Chat avec votre Coach</h1>
        
        <div className="bg-background rounded-lg border h-full overflow-hidden">
          <EnhancedCoachChat 
            initialMessage="Bonjour, comment puis-je vous aider aujourd'hui ?" 
            showCharacter={true}
            showHeader={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachChatPage;
