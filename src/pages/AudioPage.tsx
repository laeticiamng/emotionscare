
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Headphones, Mic } from 'lucide-react';
import AudioPlayerSection from '@/components/audio/AudioPlayerSection';
import AudioRecorderSection from '@/components/audio/AudioRecorderSection';

const AudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('listen');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Thérapie Audio</h1>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="listen" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Écouter
            </TabsTrigger>
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Enregistrer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listen">
            <Card>
              <CardContent className="pt-6">
                <AudioPlayerSection />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="record">
            <Card>
              <CardContent className="pt-6">
                <AudioRecorderSection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AudioPage;
