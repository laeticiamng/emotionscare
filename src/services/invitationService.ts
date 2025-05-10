
import { InvitationStats, InvitationFormData } from '@/types';

class InvitationService {
  // Generate invitation statistics
  getInvitationStats(): InvitationStats {
    return {
      total: 50,
      sent: 42,
      pending: 8,
      accepted: 30,
      expired: 3,
      rejected: 9,
      completed: 30, // Added required property
      conversionRate: 0.71, // Added required property
      averageTimeToAccept: 14.5, // Added required property in hours
      recent_invites: [], // Added required property
      teams: {}
    };
  }

  // Send invitation
  async sendInvitation(data: InvitationFormData): Promise<boolean> {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Sending invitation to:', data.email);
        resolve(true);
      }, 1000);
    });
  }

  // Get list of pending invitations
  async getPendingInvitations(): Promise<any[]> {
    return [
      { id: '1', email: 'john@example.com', role: 'user', sent: new Date() },
      { id: '2', email: 'jane@example.com', role: 'admin', sent: new Date() }
    ];
  }
}

export default new InvitationService();
