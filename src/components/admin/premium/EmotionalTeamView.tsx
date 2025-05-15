
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Period, EmotionalTeamViewProps } from '@/types';

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({
  teamId,
  period = 'week',
  userId,
  anonymized = true
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch team emotional data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // Mock data loading
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        toast({
          title: "Error loading team data",
          description: "Please try again later",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [teamId, period, toast]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Emotional Health</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <p className="text-center">Team emotional health overview for <strong>{anonymized ? 'Anonymous Team' : `Team ${teamId}`}</strong></p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Happiness', 'Stress', 'Engagement', 'Focus'].map(metric => (
                    <div key={metric} className="bg-card p-4 rounded-md border shadow-sm">
                      <h3 className="text-sm font-medium mb-2">{metric}</h3>
                      <div className="text-2xl font-bold">
                        {Math.floor(Math.random() * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.random() > 0.5 ? '↑' : '↓'} {Math.floor(Math.random() * 10)}% from last {period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Trend visualization will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="individual">
            <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Individual team member data will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmotionalTeamView;
