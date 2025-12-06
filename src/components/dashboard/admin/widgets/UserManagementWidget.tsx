// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCog, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@techcorp.com',
    department: 'Marketing',
    role: 'Collaborateur',
    score: 85,
    lastActivity: '2 heures',
    status: 'active'
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    email: 'thomas.dubois@techcorp.com',
    department: 'Tech',
    role: 'Lead',
    score: 72,
    lastActivity: '1 jour',
    status: 'active'
  },
  {
    id: 3,
    name: 'Julie Leroux',
    email: 'julie.leroux@techcorp.com',
    department: 'HR',
    role: 'Admin',
    score: 92,
    lastActivity: '30 min',
    status: 'active'
  },
  {
    id: 4,
    name: 'Marc Durand',
    email: 'marc.durand@techcorp.com',
    department: 'Sales',
    role: 'Collaborateur',
    score: 45,
    lastActivity: '3 jours',
    status: 'attention'
  }
];

export const UserManagementWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'attention': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Gestion Utilisateurs
          </CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Inviter
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{user.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </span>
                    <span>{user.department}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(user.score)}`}>
                    {user.score}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {user.lastActivity}
                  </div>
                </div>
                
                <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                  {user.status === 'active' ? 'Actif' : 'Attention'}
                </Badge>
                
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Total: {users.length} utilisateurs</span>
            <div className="flex items-center gap-4">
              <span className="text-green-600">Actifs: {users.filter(u => u.status === 'active').length}</span>
              <span className="text-red-600">Attention: {users.filter(u => u.status === 'attention').length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
