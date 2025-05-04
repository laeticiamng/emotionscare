
import React from 'react';
import { Group } from '@/types/community';
import { Card } from '@/components/ui/card';
import GroupItem from './GroupItem';

interface GroupListComponentProps {
  groups: Group[];
  userHasJoined: (group: Group) => boolean;
  handleJoin: (groupId: string) => void;
  joining: string | null;
  loading: boolean;
}

const GroupListComponent: React.FC<GroupListComponentProps> = ({ 
  groups, 
  userHasJoined, 
  handleJoin, 
  joining, 
  loading 
}) => {
  if (loading) {
    return (
      <Card className="p-6 text-center">
        <p>Chargement des groupes...</p>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>Aucun groupe disponible. Créez le premier!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          userHasJoined={userHasJoined(group)}
          onJoin={() => handleJoin(group.id)}
          isJoining={joining === group.id}
        />
      ))}
    </div>
  );
};

export default GroupListComponent;
