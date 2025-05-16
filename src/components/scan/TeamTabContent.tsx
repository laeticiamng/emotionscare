
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TeamTabContentProps {
  teamId?: string;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ teamId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Mock team members data
  const mockTeamMembers = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      avatar_url: '/avatars/jean.jpg',
      role: 'b2b_user' as const,
      emotional_score: { joy: 70, calm: 50, focus: 80, anxiety: 20 }
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      avatar_url: '/avatars/marie.jpg',
      role: 'b2b_user' as const,
      emotional_score: { joy: 60, calm: 75, focus: 65, anxiety: 15 }
    },
    {
      id: '3',
      name: 'Thomas Bernard',
      email: 'thomas.bernard@example.com',
      avatar_url: '/avatars/thomas.jpg',
      role: 'b2b_user' as const,
      emotional_score: { joy: 45, calm: 60, focus: 70, anxiety: 35 }
    }
  ];
  
  const [teamMembers, setTeamMembers] = useState<User[]>(mockTeamMembers as User[]);
  
  const handleSendSurvey = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Sondage envoyé',
        description: 'Le sondage de bien-être a été envoyé à tous les membres de l\'équipe',
        variant: 'success'
      });
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Équipe {teamId || '1'}</h2>
        <Button onClick={handleSendSurvey} disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer un sondage de bien-être'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

interface TeamMemberCardProps {
  member: User & { emotional_score?: any };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const getEmotionalStatus = (emotionalScore: any) => {
    if (!emotionalScore) return { status: 'neutral', label: 'Non mesuré' };
    
    const { joy, anxiety } = emotionalScore;
    
    if (joy > 65 && anxiety < 25) return { status: 'good', label: 'Bien-être élevé' };
    if (joy < 40 || anxiety > 60) return { status: 'poor', label: 'Attention requise' };
    return { status: 'neutral', label: 'État normal' };
  };
  
  const status = getEmotionalStatus(member.emotional_score);
  
  const statusColors = {
    good: 'bg-green-100 text-green-800',
    neutral: 'bg-blue-100 text-blue-800',
    poor: 'bg-amber-100 text-amber-800'
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            {member.avatar_url ? (
              <img 
                src={member.avatar_url} 
                alt={member.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${statusColors[status.status as keyof typeof statusColors]}`}>
            {status.label}
          </div>
          
          {member.emotional_score && (
            <div className="mt-3 space-y-2">
              <EmotionBar 
                label="Joie" 
                value={member.emotional_score.joy} 
                color="bg-amber-500" 
              />
              <EmotionBar 
                label="Calme" 
                value={member.emotional_score.calm} 
                color="bg-blue-500" 
              />
              <EmotionBar 
                label="Focus" 
                value={member.emotional_score.focus} 
                color="bg-green-500" 
              />
              <EmotionBar 
                label="Anxiété" 
                value={member.emotional_score.anxiety} 
                color="bg-indigo-500" 
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EmotionBarProps {
  label: string;
  value: number;
  color: string;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ label, value, color }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TeamTabContent;
