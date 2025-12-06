import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/types/group';
import GroupItem from './GroupItem';

interface GroupListProps {
  groups: Group[];
  loading?: boolean;
  onGroupSelect?: (group: Group) => void;
}

const GroupList: React.FC<GroupListProps> = ({ 
  groups, 
  loading = false,
  onGroupSelect 
}) => {
  const navigate = useNavigate();
  
  const handleGroupClick = (group: Group) => {
    if (onGroupSelect) {
      onGroupSelect(group);
    } else {
      navigate(`/community/groups/${group.id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }
  
  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun groupe trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {groups.map(group => (
        <GroupItem 
          key={group.id} 
          group={group} 
          onClick={() => handleGroupClick(group)}
        />
      ))}
    </div>
  );
};

export default GroupList;
