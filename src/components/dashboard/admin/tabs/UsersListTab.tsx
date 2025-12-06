
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTableDemo } from '../UsersTableDemo';
import { UsersTableWithInfiniteScroll } from '../UsersTableWithInfiniteScroll';
import PaginationSettings from '../settings/PaginationSettings';

const UsersListTab: React.FC = () => {
  const [paginationType, setPaginationType] = useState<string>("paginated");
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Visualisez et gérez les utilisateurs de la plateforme avec différentes options de pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paginated" value={paginationType} onValueChange={setPaginationType}>
            <TabsList className="mb-4">
              <TabsTrigger value="paginated">Pagination standard</TabsTrigger>
              <TabsTrigger value="load-more">Charger plus</TabsTrigger>
              <TabsTrigger value="infinite">Défilement infini</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paginated">
              <UsersTableDemo showLoadMoreButton={false} />
            </TabsContent>
            
            <TabsContent value="load-more">
              <UsersTableDemo showLoadMoreButton={true} />
            </TabsContent>
            
            <TabsContent value="infinite">
              <UsersTableWithInfiniteScroll />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <PaginationSettings />
    </div>
  );
};

export default UsersListTab;
