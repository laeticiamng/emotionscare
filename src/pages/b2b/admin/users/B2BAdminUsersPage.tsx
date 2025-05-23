
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, UserPlus, Mail, MoreHorizontal } from 'lucide-react';

const B2BAdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Marie Dubois', email: 'marie.dubois@entreprise.com', role: 'Collaborateur', status: 'Actif', lastActivity: '2 min' },
    { id: 2, name: 'Pierre Martin', email: 'pierre.martin@entreprise.com', role: 'Manager', status: 'Actif', lastActivity: '1h' },
    { id: 3, name: 'Sophie Leblanc', email: 'sophie.leblanc@entreprise.com', role: 'RH', status: 'Actif', lastActivity: '30 min' },
    { id: 4, name: 'Demo User', email: 'demo@exemple.fr', role: 'Demo', status: 'Demo', lastActivity: 'Test' },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Administration des comptes et permissions
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter un utilisateur
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Liste des utilisateurs ({filteredUsers.length})
            </CardTitle>
            <CardDescription>
              Gérez les accès et permissions de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={user.status === 'Demo' ? 'secondary' : 'default'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'Actif' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {user.lastActivity}
                    </span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminUsersPage;
