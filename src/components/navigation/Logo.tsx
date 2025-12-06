// @ts-nocheck

import React from 'react';
import { Link } from 'react-router-dom';
import { BrandingOptions } from '@/types/branding';
import { useBranding } from '@/hooks/useBranding';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark' | 'default';
  href?: string;
  className?: string;
  options?: BrandingOptions;
}

const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  variant = 'default',
  href = '/',
  className = '',
  options,
}) => {
  const branding = useBranding();
  
  const logoStyles = {
    small: 'text-lg font-bold',
    medium: 'text-xl font-bold',
    large: 'text-2xl font-bold',
  };
  
  const logo = (
    <div className={`${logoStyles[size]} ${className}`}>
      <span
        className={variant === 'light' ? 'text-white' : 'text-primary'}
        style={branding.primaryColor ? { color: branding.primaryColor } : {}}
      >
        Emotion
      </span>
      <span className={variant === 'light' ? 'text-white font-light' : 'font-light'}>AI</span>
    </div>
  );
  
  if (href) {
    return <Link to={href}>{logo}</Link>;
  }
  
  return logo;
};

export default Logo;
