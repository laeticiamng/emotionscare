import { logger } from '@/lib/logger';

interface InvitationStats {
  total: number;
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
  rejected: number;
  completed: number;
  conversionRate: number;
  averageTimeToAccept: number;
  recent_invites: unknown[];
  teams: Record<string, unknown>;
}

interface InvitationFormData {
  email: string;
  role?: string;
  message?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  sent: Date;
}

class InvitationService {
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

  async sendInvitation(data: InvitationFormData): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        logger.info('Sending invitation to', { email: data.email }, 'API');
        resolve(true);
      }, 1000);
    });
  }

  async getPendingInvitations(): Promise<PendingInvitation[]> {
    return [
      { id: '1', email: 'john@example.com', role: 'user', sent: new Date() },
      { id: '2', email: 'jane@example.com', role: 'admin', sent: new Date() }
    ];
  }
  
  async fetchInvitationStats(): Promise<InvitationStats> {
    return this.getInvitationStats();
  }
}

export default new InvitationService();
export const fetchInvitationStats = () => new InvitationService().getInvitationStats();
export type { InvitationStats, InvitationFormData };
