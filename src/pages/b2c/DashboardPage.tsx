import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMusic } from '@/contexts/music';

const B2CDashboardPage: React.FC = () => {
  const { isInitialized } = useMusic();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">B2C Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Music Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Music system is {isInitialized ? 'initialized' : 'not initialized'}.
            </p>
          </CardContent>
        </Card>
        
        {/* More dashboard content would go here */}
      </div>
    </div>
  );
};

export default B2CDashboardPage;
