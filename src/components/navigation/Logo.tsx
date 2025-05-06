
import React from 'react';
import { NavLink } from 'react-router-dom';

interface LogoProps {
  isAdmin: boolean;
}

const Logo: React.FC<LogoProps> = ({ isAdmin }) => {
  return (
    <NavLink to="/dashboard" className="flex items-center space-x-2">
      <span className="font-bold text-lg text-primary">
        {isAdmin ? "EmotionsCare Admin" : "EmotionsCare"}
      </span>
      <span className="text-xs text-muted-foreground">par ResiMax™ 4.0</span>
    </NavLink>
  );
};

export default Logo;
