
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isAdmin?: boolean;
  homePath?: string;
}

const Logo: React.FC<LogoProps> = ({ isAdmin = false, homePath = "/" }) => {
  return (
    <Link to={homePath} className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md group">
      <div className="font-semibold text-xl tracking-tight">
        <span className="group-hover:opacity-90 transition-opacity">
          Emotions<span className="text-primary font-semibold">Care</span>
        </span>
        <span className="text-xs align-super ml-0.5 text-primary/80">™</span>
      </div>
      {isAdmin && (
        <div className="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium">
          Admin
        </div>
      )}
    </Link>
  );
};

export default Logo;
