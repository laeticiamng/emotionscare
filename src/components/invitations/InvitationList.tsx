
import React from 'react';
import { InvitationData } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, Eye, Trash } from 'lucide-react';

interface InvitationListProps {
  invitations: InvitationData[];
  isLoading?: boolean;
  onResend?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isLoading = false,
  onResend,
  onDelete,
  onView
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune invitation trouvée
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'accepted':
        return <Badge variant="success">Acceptée</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expirée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="p-4 border rounded-lg bg-background shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <p className="font-medium">{invitation.email}</p>
              <div className="flex items-center gap-2">
                {getStatusBadge(invitation.status)}
                <Badge variant="outline">{invitation.role}</Badge>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              <span>
                Envoyée {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true, locale: fr })}
              </span>
              <span className="mx-2">•</span>
              <span>
                Expire {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true, locale: fr })}
              </span>
              {invitation.accepted_at && (
                <>
                  <span className="mx-2">•</span>
                  <span>
                    Acceptée {formatDistanceToNow(new Date(invitation.accepted_at), { addSuffix: true, locale: fr })}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {invitation.status === 'pending' && onResend && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onResend(invitation.id)}
              >
                <Send className="h-4 w-4 mr-1" /> Renvoyer
              </Button>
            )}
            
            {onView && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onView(invitation.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(invitation.id)}
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
