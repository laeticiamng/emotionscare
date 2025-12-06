
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

interface AdminTabContentProps {
  children: React.ReactNode;
  value: string;
  title: string;
  description?: string;
  className?: string;
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({
  children,
  value,
  title,
  description,
  className,
}) => {
  return (
    <TabsContent value={value} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </TabsContent>
  );
};

export default AdminTabContent;
