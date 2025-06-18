
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UnifiedActionButtons from '@/components/home/UnifiedActionButtons';

const ImmersiveHome: React.FC = () => {
  console.log('ImmersiveHome component is rendering');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              EmotionsCare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-xl text-gray-600">
              Plateforme premium de bien-être émotionnel
            </p>
            <p className="text-gray-500">
              Choisissez votre espace pour commencer votre parcours de bien-être
            </p>
            <UnifiedActionButtons />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImmersiveHome;
