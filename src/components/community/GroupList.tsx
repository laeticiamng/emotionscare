
import React from 'react';
import { Group } from '@/types/community';
import { Card } from '@/components/ui/card';
import GroupItem from './GroupItem';
import { Users } from 'lucide-react';

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
  joining
}) => {
  if (groups.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2 py-8">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium mt-2">Aucun groupe disponible</h3>
          <p className="text-muted-foreground">
            Créez le premier groupe pour commencer la discussion !
          </p>
        </div>
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
