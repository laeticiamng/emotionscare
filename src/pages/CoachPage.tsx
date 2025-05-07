
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';

const CoachPage = () => {
  const { user } = useAuth();
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Coach IA</h1>
          <p className="text-muted-foreground">Conseils personnalisés pour améliorer votre bien-être</p>
        </header>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Discussion avec votre coach IA</CardTitle>
            <CardDescription>
              Posez vos questions et recevez des conseils adaptés à votre situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface userId={user?.id} />
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default CoachPage;
