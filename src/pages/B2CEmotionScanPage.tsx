/**
 * B2CEmotionScanPage - Redirection vers le scan principal
 * Évite les 404 pour les anciens liens
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function B2CEmotionScanPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/scan', { replace: true });
  }, [navigate]);

  return null;
}