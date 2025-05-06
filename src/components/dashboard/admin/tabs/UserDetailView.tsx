
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';
import { UserProfile } from '@/components/dashboard/admin/UserProfile';
import { EmotionalScoreChart } from '@/components/dashboard/EmotionalScoreChart';
import { UserActivityTimeline } from '@/components/dashboard/admin/UserActivityTimeline';
import { useToast } from '@/hooks/use-toast';
import { generateMockMoodData } from '@/lib/mockDataGenerator';

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ userId, onBack }) => {
  const { toast } = useToast();
  
  // This would come from an API call in a real app
  const user = {
    id: userId,
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    role: 'user',
    anonymity_code: 'SM472931',
    joined_at: '2023-01-15T10:30:00Z',
    last_active: '2023-07-23T14:22:00Z',
    emotional_score: 82,
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  const handleContactUser = () => {
    toast({
      title: 'Message envoyé',
      description: `Un message a été envoyé à ${user.name}`,
    });
  };

  const moodData = generateMockMoodData(30);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Button>
        <Button onClick={handleContactUser}>
          <Send className="mr-2 h-4 w-4" />
          Contacter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <UserProfile user={user} />
        </div>

        {/* Emotional Score Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Score émotionnel</CardTitle>
              <CardDescription>
                Évolution du score émotionnel sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <EmotionalScoreChart data={moodData} showTooltip={true} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Historique d'activité anonymisé</CardDescription>
        </CardHeader>
        <CardContent>
          <UserActivityTimeline userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailView;
