
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockNewUsers = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.m@example.com',
    joinedDate: '2025-05-12',
    department: 'Marketing'
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas.d@example.com',
    joinedDate: '2025-05-11',
    department: 'R&D'
  },
  {
    id: '3',
    name: 'Julie Leroux',
    email: 'julie.l@example.com',
    joinedDate: '2025-05-10',
    department: 'RH'
  }
];

const NewUsersCard: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockNewUsers.map(user => (
        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.department}</p>
          </div>
          
          <div className="text-xs text-right text-muted-foreground">
            {new Date(user.joinedDate).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </div>
        </div>
      ))}
      
      {mockNewUsers.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>Aucun nouvel utilisateur récemment</p>
        </div>
      )}
    </div>
  );
};

export { NewUsersCard };
export default NewUsersCard;
