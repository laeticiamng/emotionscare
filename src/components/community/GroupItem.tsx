
import React from 'react';
import { Group } from '@/types/community';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{group.name}</h3>
            <Badge variant="outline" className="bg-secondary/20">
              {group.topic || (group.tags && group.tags[0]) || "Général"}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members?.length || group.member_count || 0} membres</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-gray-500">{group.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {userHasJoined ? (
          <Badge variant="secondary" className="py-1 px-3">
            <Users className="h-3 w-3 mr-1 inline" />
            Membre
          </Badge>
        ) : (
          <Button
            variant="default"
            onClick={onJoin}
            disabled={isJoining}
            className="w-full sm:w-auto"
          >
            {isJoining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              "Rejoindre"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupItem;
