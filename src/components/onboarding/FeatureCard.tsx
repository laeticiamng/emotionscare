
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon,
  title, 
  description 
}) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon className="h-8 w-8 mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
