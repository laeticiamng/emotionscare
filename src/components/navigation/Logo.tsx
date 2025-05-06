
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isAdmin?: boolean;
  homePath?: string;
}

const Logo: React.FC<LogoProps> = ({ isAdmin = false, homePath = "/" }) => {
  return (
    <Link to={homePath} className="flex items-center gap-2 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md">
      <div className="font-medium text-lg">
        <span>Emotions<span className="text-primary">Care</span></span>
        <span className="text-xs align-super">™</span>
      </div>
      {isAdmin && (
        <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
          Admin
        </div>
      )}
    </Link>
  );
};

export default Logo;
