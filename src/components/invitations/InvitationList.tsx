// @ts-nocheck

import React from 'react';
import { InvitationData } from '@/types/invitation';
import { formatDate } from '@/utils';

interface InvitationListProps {
  invitations: InvitationData[];
  isLoading?: boolean;
}

const InvitationList: React.FC<InvitationListProps> = ({ 
  invitations,
  isLoading = false
}) => {
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Acceptée</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Expirée</span>;
      case 'revoked':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Révoquée</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDateField = (date: string | undefined) => {
    if (!date) return 'N/A';
    return formatDate(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Rôle</th>
            <th className="px-4 py-2 text-left">Statut</th>
            <th className="px-4 py-2 text-left">Envoyée le</th>
            <th className="px-4 py-2 text-left">Expire le</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">Chargement...</td>
            </tr>
          ) : invitations.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">Aucune invitation trouvée</td>
            </tr>
          ) : (
            invitations.map((invitation) => (
              <tr key={invitation.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-2">{invitation.email}</td>
                <td className="px-4 py-2">{invitation.role}</td>
                <td className="px-4 py-2">{renderStatusBadge(invitation.status)}</td>
                <td className="px-4 py-2">{formatDateField(invitation.sent_at)}</td>
                <td className="px-4 py-2">{formatDateField(invitation.expires_at)}</td>
                <td className="px-4 py-2">
                  {/* Action buttons would go here */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationList;
