
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmotionalQuiz from './EmotionalQuiz';
import CommunityChallenge from './CommunityChallenge';
import LearningCenter from './LearningCenter';
import PodcastPlayer from './PodcastPlayer';
import { useUserMode } from '@/contexts/UserModeContext';

const FeatureHub: React.FC = () => {
  const { userMode } = useUserMode();
  const isAdmin = userMode === 'b2b-admin';
  
  return (
    <div className="w-full animate-fade-in">
      <Card className="shadow-sm border-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="bg-primary/10 p-1.5 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </span>
            Expérience Émotionnelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                Quiz & Sondages
              </TabsTrigger>
              <TabsTrigger value="challenges" className="text-xs sm:text-sm">
                Challenges
              </TabsTrigger>
              <TabsTrigger value="learning" className="text-xs sm:text-sm">
                Tutoriels
              </TabsTrigger>
              <TabsTrigger value="podcast" className="text-xs sm:text-sm">
                Podcasts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quiz" className="mt-0">
              <EmotionalQuiz isAdmin={isAdmin} />
            </TabsContent>
            
            <TabsContent value="challenges" className="mt-0">
              <CommunityChallenge isAdmin={isAdmin} />
            </TabsContent>
            
            <TabsContent value="learning" className="mt-0">
              <LearningCenter />
            </TabsContent>
            
            <TabsContent value="podcast" className="mt-0">
              <PodcastPlayer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureHub;
