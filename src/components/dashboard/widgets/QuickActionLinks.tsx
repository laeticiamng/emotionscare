
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuickActionLinksProps } from '@/types/widgets';

const QuickActionLinks: React.FC<QuickActionLinksProps> = ({ links }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {links.map((link, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <a href={link.href} className="flex flex-col h-full no-underline">
              <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                {link.icon}
              </div>
              <h3 className="font-medium text-base mb-1">{link.title}</h3>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActionLinks;
