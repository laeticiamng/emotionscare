
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CallToActionProps {
  type: 'user' | 'admin';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ type, className = '' }) => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    if (type === 'user') {
      navigate('/login');
    } else {
      navigate('/admin-login');
    }
  };
  
  return (
    <Button 
      onClick={handleNavigate}
      size="lg"
      className={`w-full hover-lift shadow-premium transition-all duration-300 ${className}`}
      variant={type === 'admin' ? 'outline' : 'default'}
    >
      <span className="mr-2.5">{type === 'user' ? 'Me connecter' : 'Connexion Admin'}</span>
      <ArrowRight size={18} />
    </Button>
  );
};

export default CallToAction;
