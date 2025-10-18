// @ts-nocheck

import { InvitationStats, InvitationFormData } from '@/types';
import { logger } from '@/lib/logger';

class InvitationService {
  // Générer les statistiques d'invitation
  getInvitationStats(): InvitationStats {
    return {
      total: 50,
      sent: 42,
      pending: 8,
      accepted: 30,
      expired: 3,
      rejected: 9,
      completed: 30,
      conversionRate: 0.71,
      averageTimeToAccept: 14.5,
      recent_invites: [],
      teams: {}
    };
  }

  // Envoi d'invitation
  async sendInvitation(data: InvitationFormData): Promise<boolean> {
    // Simulation d'appel API
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info('Sending invitation to', { email: data.email }, 'API');
        resolve(true);
      }, 1000);
    });
  }

  // Récupérer la liste des invitations en attente
  async getPendingInvitations(): Promise<any[]> {
    return [
      { id: '1', email: 'john@example.com', role: 'user', sent: new Date() },
      { id: '2', email: 'jane@example.com', role: 'admin', sent: new Date() }
    ];
  }
  
  // Pour la compatibilité avec InvitationsTab
  async fetchInvitationStats(): Promise<InvitationStats> {
    return this.getInvitationStats();
  }
}

export default new InvitationService();
// Exporter également la méthode fetchInvitationStats pour la compatibilité
export const fetchInvitationStats = () => new InvitationService().getInvitationStats();
