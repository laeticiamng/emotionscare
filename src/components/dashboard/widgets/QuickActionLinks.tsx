
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface QuickActionLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

interface QuickActionLinksProps {
  links: QuickActionLink[];
}

const QuickActionLinks: React.FC<QuickActionLinksProps> = ({ links }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.href}
          className="flex flex-col h-full p-3 rounded-lg border hover:shadow-md transition-all bg-card"
        >
          <div className={`${link.color || 'bg-primary'} w-9 h-9 rounded-full flex items-center justify-center text-white mb-2`}>
            {link.icon}
          </div>
          <div>
            <h3 className="font-medium text-sm">{link.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActionLinks;
