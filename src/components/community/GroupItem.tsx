
import React from 'react';
import { Group } from '@/types/community';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface GroupItemProps {
  group: Group;
  userHasJoined: boolean;
  onJoin: () => void;
  isJoining: boolean;
}

const GroupItem: React.FC<GroupItemProps> = ({ 
  group, 
  userHasJoined, 
  onJoin, 
  isJoining 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{group.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members?.length || 0} membres</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 font-medium">Thème: {group.topic}</p>
        {group.description && (
          <p className="mt-2 text-gray-500">{group.description}</p>
        )}
      </CardContent>
      <CardFooter>
        {userHasJoined ? (
          <Button variant="outline" disabled className="w-full sm:w-auto">
            Membre
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onJoin}
            disabled={isJoining}
            className="w-full sm:w-auto"
          >
            {isJoining ? 'En cours...' : 'Rejoindre'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupItem;
