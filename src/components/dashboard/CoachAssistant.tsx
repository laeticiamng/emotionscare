
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
    <Card className={cn("flex flex-col bg-gradient-to-br from-cocoon-50 to-white border-cocoon-100", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-cocoon-600" />
          Coach IA
        </CardTitle>
      </CardHeader>
      
      <ChatInterface standalone={false} />
    </Card>
  );
};

export default CoachAssistant;
