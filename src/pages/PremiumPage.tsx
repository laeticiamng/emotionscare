// @ts-nocheck
/**
 * PremiumPage - Upgrade vers les plans payants
 * Redirige vers la page Pricing canonique pour éviter toute incohérence tarifaire
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PremiumPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/pricing', { replace: true });
  }, [navigate]);

  return null;
}
