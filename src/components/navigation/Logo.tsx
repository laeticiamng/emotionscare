
import React from 'react';
import { Link } from 'react-router-dom';
import { useBranding, BrandingOptions } from '@/hooks/useBranding';

interface LogoProps {
  isAdmin?: boolean;
  homePath?: string;
  size?: BrandingOptions['size'];
  variant?: BrandingOptions['variant'];
}

const Logo: React.FC<LogoProps> = ({ 
  isAdmin = false, 
  homePath = "/",
  size = 'md',
  variant = 'default'
}) => {
  const { logoPath, getLogoSize, primaryColor } = useBranding();
  const showText = variant !== 'minimal';
  
  return (
    <Link to={homePath} className="flex items-center gap-2.5 transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md group">
      <div className="flex items-center">
        <img 
          src={logoPath}
          alt="EmotionsCare Logo" 
          className={`${getLogoSize(size)} mr-2`}
        />
        
        {showText && (
          <div className="font-semibold text-xl tracking-tight">
            <span className="group-hover:opacity-90 transition-opacity">
              Emotions<span className="text-primary font-semibold">Care</span>
            </span>
            <span className="text-xs align-super ml-0.5 text-primary/80">™</span>
          </div>
        )}
        
        {isAdmin && (
          <div className="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium ml-2">
            Admin
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
