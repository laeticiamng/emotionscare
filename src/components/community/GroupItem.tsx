import React from 'react';
import { Card } from '@/components/ui/card';
import { Group } from '@/types/group';

interface GroupItemProps {
  group: Group;
  onClick?: () => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className="p-4 hover:bg-accent cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          {group.image_url ? (
            <img 
              src={group.image_url} 
              alt={group.name} 
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {group.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div>
          <h3 className="font-medium">{group.name}</h3>
          <p className="text-xs text-muted-foreground">
            {group.members_count} membres • {group.topic}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GroupItem;
