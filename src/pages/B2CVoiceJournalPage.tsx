/**
 * B2CVoiceJournalPage - Redirection vers le journal principal
 * Évite les 404 pour les anciens liens
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function B2CVoiceJournalPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/journal', { replace: true });
  }, [navigate]);

  return null;
}