
import React from 'react';
import TeamOverview from '@/components/scan/TeamOverview';
import { User, TeamOverviewProps } from '@/types/types';

interface TeamTabContentProps {
  teamId?: string;
  userId: string;
}

// Sample team members data for demonstration
const mockTeamMembers: Partial<User>[] = [
  {
    id: '1',
    name: 'Alice Martin',
    position: 'Développeur',
    emotional_score: 85
  },
  {
    id: '2',
    name: 'Thomas Dupont',
    position: 'Designer',
    emotional_score: 72
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    position: 'Chef de projet',
    emotional_score: 68
  }
];

const TeamTabContent: React.FC<TeamTabContentProps> = ({ teamId, userId }) => {
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  
  // Handler for when a team member is clicked
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    console.log(`Selected user: ${userId}`);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Vue d'équipe</h2>
      <p className="text-muted-foreground">
        Visualisez l'état émotionnel de votre équipe et identifiez les tendances collectives.
      </p>
      
      <TeamOverview 
        users={mockTeamMembers} 
        onUserClick={handleUserClick}
        userId={userId}
        teamId={teamId}
      />
    </div>
  );
};

export default TeamTabContent;
