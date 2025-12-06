// @ts-nocheck

import React from 'react';
import { BookOpen } from 'lucide-react';

interface JournalPageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const JournalPageHeader: React.FC<JournalPageHeaderProps> = ({
  title,
  description,
  icon = <BookOpen className="h-5 w-5" />,
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="flex items-center gap-2">
        {icon}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default JournalPageHeader;
