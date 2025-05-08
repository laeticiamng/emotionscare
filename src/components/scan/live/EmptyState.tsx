
import React from 'react';
import { Mic } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Mic className="h-8 w-8 text-primary" />
      </div>
      <p className="text-muted-foreground text-sm max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;
