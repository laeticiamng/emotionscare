
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleName } from '@/utils/roleUtils';
import { UserRole } from '@/types/user';

interface AuthButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'default',
  size = 'default',
  showIcon = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleClick = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/');
    } else {
      navigate('/b2c/login');
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleClick}
      className={className}
    >
      {showIcon && (
        isAuthenticated ? 
          <LogOut className="mr-2 h-4 w-4" /> : 
          <LogIn className="mr-2 h-4 w-4" />
      )}
      {isAuthenticated ? 
        `Déconnexion ${user && user.role ? `(${getRoleName(user.role as UserRole)})` : ''}` : 
        'Se connecter'
      }
    </Button>
  );
};

export default AuthButton;
