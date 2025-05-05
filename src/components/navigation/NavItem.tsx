
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log(`NavItem render: ${label}, to: ${to}, current path: ${location.pathname}`);
  
  // If active is not explicitly provided, determine from current location
  const isActive = active !== undefined ? active : location.pathname === to;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`NavItem clicked: ${label}, navigating to ${to}`);
    navigate(to);
  };

  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
        isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
      }`}
      onClick={handleClick}
    >
      {icon}
      {label}
    </button>
  );
};

export default NavItem;
