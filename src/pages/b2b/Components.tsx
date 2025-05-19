
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const B2BComponentsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">B2B UI Components</h1>
      <p className="text-muted-foreground mb-8">
        This page showcases the various UI components available for B2B applications.
      </p>
      
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Card</CardTitle>
                <CardDescription>Display key metrics and data visualizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Example analytics card with charts and data visualization components.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Card</CardTitle>
                <CardDescription>Display user information and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Example user card with avatar, name, role, and action buttons.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Card</CardTitle>
                <CardDescription>Display report summaries and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Example report card with key findings and download options.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variations</CardTitle>
              <CardDescription>Different button styles and sizes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Button examples would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields, selects, and other form elements</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Form component examples would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BComponentsPage;
