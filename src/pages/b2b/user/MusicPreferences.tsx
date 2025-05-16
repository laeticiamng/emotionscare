
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const B2BUserMusicPreferences: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Music Preferences - Enterprise Edition</h1>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Your Music Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Customize your music experience with personalized preferences for the workplace.
          </p>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p>Music preference settings will be displayed here...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserMusicPreferences;
