
import React from 'react';

interface DashboardFooterProps {
  isAdmin?: boolean;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({ isAdmin = false }) => {
  return (
    <div className="mt-12 py-6 border-t text-center text-sm text-muted-foreground">
      {isAdmin ? (
        <p>Données chiffrées AES-256, anonymisées et agrégées, conformité GDPR et loi RGPD</p>
      ) : (
        <p>Données chiffrées AES-256, authentification Supabase Auth, permissions RBAC strictes, conformité GDPR</p>
      )}
    </div>
  );
};

export default DashboardFooter;
