
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Building } from 'lucide-react';

interface CallToActionProps {
  type: 'personal' | 'business';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ type, className = '' }) => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    if (type === 'personal') {
      navigate('/login');
    } else {
      navigate('/business');
    }
  };
  
  return (
    <Button 
      onClick={handleNavigate}
      size="lg"
      className={`w-full hover-lift shadow-premium transition-all duration-300 ${className}`}
      variant={type === 'business' ? 'outline' : 'default'}
    >
      {type === 'personal' ? (
        <>
          <User className="mr-2 h-5 w-5" />
          <span>Particulier</span>
        </>
      ) : (
        <>
          <Building className="mr-2 h-5 w-5" />
          <span>Entreprise</span>
        </>
      )}
      <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-0.5" />
    </Button>
  );
};

export default CallToAction;
