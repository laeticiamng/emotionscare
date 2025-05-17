
import React from 'react';
import { useUserModeHelpers } from '@/hooks/useUserModeHelpers';

interface ModeAwareContentProps {
  b2cContent?: React.ReactNode;
  b2bUserContent?: React.ReactNode;
  b2bAdminContent?: React.ReactNode;
  fallbackContent?: React.ReactNode;
}

/**
 * Composant qui affiche différents contenus selon le mode utilisateur actuel
 */
const ModeAwareContent: React.FC<ModeAwareContentProps> = ({
  b2cContent,
  b2bUserContent,
  b2bAdminContent,
  fallbackContent
}) => {
  const { isB2C, isB2BUser, isB2BAdmin } = useUserModeHelpers();
  
  if (isB2C && b2cContent) {
    return <>{b2cContent}</>;
  }
  
  if (isB2BUser && b2bUserContent) {
    return <>{b2bUserContent}</>;
  }
  
  if (isB2BAdmin && b2bAdminContent) {
    return <>{b2bAdminContent}</>;
  }
  
  // Fallback si aucun contenu spécifique au mode n'est trouvé
  return <>{fallbackContent}</>;
};

export default ModeAwareContent;
