
import React from 'react';
import TeamOverview from '@/components/scan/TeamOverview';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

interface TeamTabContentProps {
  teamId?: string;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ teamId }) => {
  const { user } = useAuth();

  // Mock user data for demonstration
  const mockUsers: Partial<User>[] = [
    { id: '1', name: 'Alice', avatar: '/avatars/avatar-1.png', emotional_score: 75 },
    { id: '2', name: 'Bob', avatar: '/avatars/avatar-2.png', emotional_score: 60 },
    { id: '3', name: 'Charlie', avatar: '/avatars/avatar-3.png', emotional_score: 80 },
    { id: '4', name: 'David', avatar: '/avatars/avatar-4.png', emotional_score: 90 },
    { id: '5', name: 'Eve', avatar: '/avatars/avatar-5.png', emotional_score: 70 },
  ];

  // Filter users based on team ID (if provided)
  const filteredUsers = teamId
    ? mockUsers.filter(u => u.team_id === teamId)
    : mockUsers;

  const handleUserClick = (userId: string) => {
    alert(`Clicked user with ID: ${userId}`);
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Aperçu de l'équipe et de leur état émotionnel.
      </p>
      
      {/* Team Overview Component */}
      <TeamOverview 
        users={filteredUsers} 
        onUserClick={handleUserClick} 
      />
    </div>
  );
};

export default TeamTabContent;
