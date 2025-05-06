
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserData } from '../types/tableTypes';

interface UserTableRowProps {
  user: UserData;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user }) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {user.emotional_score ?? 'N/A'}
          {user.emotional_score && (
            <span 
              className={`h-2 w-2 rounded-full ${
                user.emotional_score >= 70 ? 'bg-green-500' : 
                user.emotional_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{user.role}</Badge>
      </TableCell>
      <TableCell className="text-right font-mono">
        {user.anonymity_code || '-'}
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
