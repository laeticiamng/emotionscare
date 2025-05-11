
import React from 'react';
import { Button } from '@/components/ui/button';
import { InvitationData, UserRole } from '@/types';
import { Check, Clock, X, Trash, Send, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName } from '@/utils/roleUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvitationListProps {
  invitations: InvitationData[];
  isLoading: boolean;
  onResend?: (invitation: InvitationData) => void;
  onDelete?: (invitation: InvitationData) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({ 
  invitations, 
  isLoading,
  onResend,
  onDelete
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'expired':
        return <X className="h-4 w-4 text-red-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Acceptée</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">En attente</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expirée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejetée</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr });
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucune invitation dans cette catégorie
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{invitation.email}</span>
              {getStatusBadge(invitation.status)}
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-3">
              <span>Rôle: {getRoleDisplayName(invitation.role as UserRole)}</span>
              <span>•</span>
              <span>Envoyée {formatDate(invitation.created_at)}</span>
              {invitation.expires_at && invitation.status === 'pending' && (
                <>
                  <span>•</span>
                  <span>Expire {formatDate(invitation.expires_at)}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {invitation.status === 'pending' && onResend && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onResend(invitation)}
                title="Renvoyer l'invitation"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            
            {(invitation.status === 'expired' || invitation.status === 'pending') && onResend && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onResend(invitation)}
                title="Renouveler l'invitation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onDelete(invitation)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Supprimer l'invitation"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitationList;
