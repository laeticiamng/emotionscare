
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserActivityLogTab from '@/components/admin/UserActivityLogTab';
import { UserData } from '../types/tableTypes';

// Add other imports as needed for other tabs

interface UserDetailViewProps {
  user: UserData;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Détails de l'utilisateur</CardTitle>
        <CardDescription>
          Informations et historique pour {user.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="activity">Historique d'activité</TabsTrigger>
            <TabsTrigger value="wellbeing">Bien-être</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            {/* Profile tab content */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm">{user.role}</p>
                </div>
              </div>
              
              {/* More profile details */}
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <UserActivityLogTab userId={user.id} />
          </TabsContent>
          
          <TabsContent value="wellbeing">
            {/* Wellbeing tab content */}
            <p>Informations sur le bien-être de l'utilisateur...</p>
          </TabsContent>
          
          <TabsContent value="settings">
            {/* Settings tab content */}
            <p>Options et paramètres du compte...</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
