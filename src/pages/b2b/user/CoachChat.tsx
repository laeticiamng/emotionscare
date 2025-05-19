
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import EnhancedCoachChat from '@/components/coach/EnhancedCoachChat';

const B2BUserCoachChatPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 h-[calc(100vh-12rem)]">
        <h1 className="text-3xl font-bold mb-6">Dialogue professionnel</h1>
        
        <div className="bg-background rounded-lg border h-full overflow-hidden">
          <EnhancedCoachChat 
            initialMessage="Bonjour, comment se passe votre journée de travail ? Je suis là pour vous aider à maintenir un bon équilibre professionnel." 
            showCharacter={true}
            showHeader={true}
          />
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Vos échanges sont confidentiels et ne sont jamais partagés avec votre entreprise. Seules des statistiques anonymisées sont disponibles.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default B2BUserCoachChatPage;
