
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const B2BAdminUsersPage: React.FC = () => {
  const users = [
    { id: 1, name: "Marie Dubois", email: "marie.dubois@entreprise.com", role: "Collaborateur", status: "Actif", wellbeingScore: 85 },
    { id: 2, name: "Thomas Martin", email: "thomas.martin@entreprise.com", role: "Collaborateur", status: "Actif", wellbeingScore: 72 },
    { id: 3, name: "Sophie Leclerc", email: "sophie.leclerc@entreprise.com", role: "Manager", status: "Actif", wellbeingScore: 91 },
  ];

  return (
    <>
      <Helmet>
        <title>Gestion des utilisateurs - EmotionsCare</title>
        <meta name="description" content="Gérez les utilisateurs de votre organisation" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-gray-600">
              Gérez les collaborateurs de votre organisation
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Inviter un utilisateur
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Liste des utilisateurs
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher..." className="w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nom</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Rôle</th>
                    <th className="text-left p-3">Statut</th>
                    <th className="text-left p-3">Score bien-être</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${user.wellbeingScore}%` }}
                            />
                          </div>
                          <span className="text-sm">{user.wellbeingScore}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default B2BAdminUsersPage;
