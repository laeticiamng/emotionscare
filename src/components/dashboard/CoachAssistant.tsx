
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface CoachAssistantProps {
  className?: string;
}

const CoachAssistant: React.FC<CoachAssistantProps> = ({ className }) => {
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" />
          Coach IA
        </CardTitle>
      </CardHeader>
      
      <ChatInterface standalone={false} />
    </Card>
  );
};

export default CoachAssistant;
